const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

//Obtener todas las transacciones ordenadas por fecha
router.get('/', async (req, res) => {
    try {
        await processRecurringTransactions();
        const limit = parseInt(req.query.limit) || 0; // 0 = sin limite
        const transactions = await Transaction.find({ isRecurring: false })
            .sort({ date: -1 })
            .limit(limit)
            .select('type amount description category date'); // Seleccionar solo campos necesarios

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las transacciones', error });
    }
});

//Agregar una nueva transaccion
router.post('/', async (req, res) => {
    console.log('🔍 POST recibido:', req.body); // ← añade esto primero
    try {
        const { type, amount, description, category, date } = req.body;

        console.log('✅ Datos extraídos:', { type, amount }); // ← verifica aquí

        //validacion basica
        if (!type || !amount) {
            console.log('❌ Tipo inválido');
            return res.status(400).json({ message: 'El tipo y el monto son obligatorios' });
        }
        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: 'El tipo debe ser "income" o "expense"' });
        }

        const transaction = new Transaction({ type, amount, description, category, date })
        console.log('💾 Guardando en MongoDB...');
        await transaction.save();
        console.log('✅ Transacción guardada con ID:', transaction._id);

        res.status(201).json(transaction);
        console.log('📤 Respuesta enviada'); // ← si esto NO aparece, el problema es arriba
    } catch (error) {
        console.error('💥 Error:', error); // ← si esto aparece, hay excepción
        res.status(500).json({ message: 'Error al crear transacción', error: error.message });
    }
});

//obtener el balance actual
router.get('/balance', async (req, res) => {
    try {
        await processRecurringTransactions();

        const result = await Transaction.aggregate([
            {
                $match: { isRecurring: false }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        //convertir array en objeto {income: total, expense:total}
        const grouped = {}
        result.forEach(item => {
            grouped[item._id] = item.total;
        });

        const income = grouped.income || 0;
        const expense = grouped.expense || 0;
        const balance = income - expense;

        res.json({ income, expense, balance });
    } catch (error) {
        res.status(500).json({ message: 'Error al calcular el balance', error });
    }
});

//obtener ultimas transacciones
router.get('/latest', async (req, res) => {
    try {
        await processRecurringTransactions();

        //Obtener el ultimo ingreso
        const lastIncome = await Transaction.findOne({ type: 'income', isRecurring: false })
            .sort({ date: -1 })
            .select('amount description category date');

        //Obtener el ultimo gasto
        const lastExpense = await Transaction.findOne({ type: 'expense', isRecurring: false })
            .sort({ date: -1, createdAt: -1 })
            .select('amount description category date');

        res.json({
            income: lastIncome || null,
            expense: lastExpense || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ultimas transacciones' })
    }
})


// === RECURRENTES ===

//Transacciones recurrentes
router.get('/recurring', async (req, res) => {
    try {
        await processRecurringTransactions();

        const recurring = await Transaction.find({
            isRecurring: true,
            'recurringConfig.isActive': true
        }).sort({ 'recurringConfig.startDate': -1 });

        res.json(recurring);
    } catch (error) {
        res.status(500).json({ message: 'error al obtener transacciones recurrentes', error });
    }
});

//Crear transaccion recurrente
router.post('/recurring', async (req, res) => {
    try {
        const { type, amount, description, category, frequency, startDate, endDate } = req.body;

        if (!type || !amount || !frequency) {
            return res.status(400).json({ message: 'Tipo, monto y frecuencia son obligatorios' });
        }

        if (type === 'income') {
            const existingActiveIncomeRecurring = await Transaction.findOne({
                type: 'income',
                isRecurring: true,
                'recurringConfig.isActive': true,
            }).sort({ 'recurringConfig.startDate': -1 });

            if (existingActiveIncomeRecurring) {
                existingActiveIncomeRecurring.amount = amount;
                existingActiveIncomeRecurring.description = description || existingActiveIncomeRecurring.description || '';
                existingActiveIncomeRecurring.category = category ?? existingActiveIncomeRecurring.category ?? null;
                existingActiveIncomeRecurring.recurringConfig.frequency = frequency;
                existingActiveIncomeRecurring.recurringConfig.startDate = startDate || existingActiveIncomeRecurring.recurringConfig.startDate || new Date();
                existingActiveIncomeRecurring.recurringConfig.endDate = endDate || null;

                // Normalizar fecha y verificar si ya pasó o es hoy
                const scheduledStartDate = new Date(existingActiveIncomeRecurring.recurringConfig.startDate);
                const normalizedStart = new Date(scheduledStartDate);
                normalizedStart.setHours(0, 0, 0, 0);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Marcar lastProcessed si la fecha ya pasó o es hoy, SOLO si no estaba marcado antes
                if (normalizedStart <= today && !existingActiveIncomeRecurring.recurringConfig.lastProcessed) {
                    existingActiveIncomeRecurring.recurringConfig.lastProcessed = normalizedStart;
                }

                await existingActiveIncomeRecurring.save();
                return res.status(200).json(existingActiveIncomeRecurring);
            }
        }

        // Normalizar y validar fecha inicial
        const scheduledStartDate = new Date(startDate || new Date());
        const normalizedStart = new Date(scheduledStartDate);
        normalizedStart.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Determinar lastProcessed: si la fecha ya pasó o es hoy, marcar como procesado para evitar duplicado inmediato
        let lastProcessedDate = null;
        if (normalizedStart <= today) {
            lastProcessedDate = normalizedStart;
        }

        const transaction = new Transaction({
            type,
            amount,
            description: description || '',
            category: category || null,
            isRecurring: true,
            recurringConfig: {
                frequency,
                startDate: scheduledStartDate,
                endDate: endDate || null,
                lastProcessed: lastProcessedDate,
                isActive: true
            }
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear transacción recurrente', error });
    }
});

//obtener transaccion recurrente activa
router.get('/recurring/active', async (req, res) => {
    try{
        const recurring = await Transaction.findOne({
            isRecurring: true,
            'recurringConfig.isActive': true,
            type: 'income'
        }).sort({ 'recurringConfig.startDate': -1 })

        res.json(recurring || null);
    } catch (error){
        res.status(500).json({ message: 'Error al obtener transacción recurrente activa', error });
    }
});

//Actualizar transaccion recurrente
router.put('/recurring/:id', async (req, res) => {
    try{
        const { amount, frequency, startDate } = req.body;

        const transaction = await Transaction.findById(req.params.id);

        if(!transaction){
            return res.status(404).json({ message: 'Transacción recurrente no encontrada' });
        }

        if(!transaction.isRecurring){
            return res.status(400).json({ message: 'La transacción no es recurrente' });
        }

        //Actualizar campos
        if(amount !== undefined) transaction.amount = amount;
        if(frequency) transaction.recurringConfig.frequency = frequency;
        if (startDate) {
            transaction.recurringConfig.startDate = startDate;

            // Normalizar fecha y verificar si ya pasó o es hoy
            const scheduledStartDate = new Date(startDate);
            const normalizedStart = new Date(scheduledStartDate);
            normalizedStart.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Marcar lastProcessed si la fecha ya pasó o es hoy, SOLO si no estaba marcado antes
            if (normalizedStart <= today && !transaction.recurringConfig.lastProcessed) {
                transaction.recurringConfig.lastProcessed = normalizedStart;
            }
        }

        await transaction.save();

        res.json(transaction);
    } catch (error){
        res.status(500).json({ message: 'Error al actualizar transacción recurrente', error });
    }
});



//Procesar transaccones recurrentes
router.post('/process-recurring', async (req, res) => {
    try {
        const processed = await processRecurringTransactions();

        res.json({ message: `${processed} transacciones recurrentes`, processed })
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar transacciones recurrentes', error });
    }
});



//Actualizar una transaccion
router.put('/:id', async (req, res) => {
    try {
        const { type, amount, description, category } = req.body;

        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        //Actualizar solo los campos
        if (type) transaction.type = type;
        if (amount !== undefined) transaction.amount = amount;
        if (description !== undefined) transaction.description = description;
        if (category !== undefined) transaction.category = category;

        await transaction.save();

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar transacción', error });
    }
})

//Eliminar una transaccion
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de transacción inválido' });
        }

        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        res.json({
            message: 'Transacción eliminada correctamente',
            transaction: deletedTransaction
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar transacción', error });
    }
})


//Obtener estadisticas mensuales
router.get('/stats/monthly', async (req, res) => {
    try{
        const { year = new Date().getFullYear(), type } = req.query;
        const parsedYear = parseInt(year, 10);

        const query = {
            date: {
                $gte: new Date(`${parsedYear}-01-01`),
                $lt: new Date(`${parsedYear + 1}-01-01`)
            }
        };

        if(type && ['income', 'expense'].includes(type)){
            query.type = type;
        }

        const stats = await Transaction.aggregate([
            { $match: query },
            {
                $group:{
                    _id:{
                        month:{$month: '$date'},
                        type: '$type'
                    },
                    total: {$sum: '$amount'}
                }
            },
            {
                $group: {
                    _id: '$_id.month',
                    income: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0]
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const monthlyData = Array.from({ length: 12 }, (_, index) => {
            const month = index + 1;
            const monthStats = stats.find((item) => item._id === month);

            return {
                month,
                income: monthStats?.income || 0,
                expense: monthStats?.expense || 0,
            };
        });

        res.json({
            year: parsedYear,
            monthlyData,
            totals: {
                income: monthlyData.reduce((sum, m) => sum + m.income, 0),
                expense: monthlyData.reduce((sum, m) => sum + m.expense, 0)
            }
        });
    } catch (error){
        res.status(500).json({ message: 'Error al obtener estadisticas', error })
    }
});









//Función helper para calcular si toca procesar
function shouldProcessRecurring(lastDate, now, frequency) {
    const last = new Date(lastDate);
    const current = new Date(now);
    
    // Normalizar a solo fecha (sin hora)
    last.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    const diffMs = current - last;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    switch (frequency) {
        case 'daily':
            return diffDays >= 1;
        case 'weekly':
            return diffDays >= 7;
        case 'biweekly':
            return diffDays >= 14;
        case 'monthly': {
            // Comparar mes a mes
            let nextDate = new Date(last);
            nextDate.setMonth(nextDate.getMonth() + 1);
            nextDate.setHours(0, 0, 0, 0);
            return current >= nextDate;
        }
        case 'yearly': {
            // Comparar año a año
            let nextDate = new Date(last);
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            nextDate.setHours(0, 0, 0, 0);
            return current >= nextDate;
        }
        default:
            return false;
    }
}

async function processRecurringTransactions() {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalizar a solo fecha
    
    const recurringTransactions = await Transaction.find({
        isRecurring: true,
        'recurringConfig.isActive': true,
    });

    let processed = 0;

    for (const transaction of recurringTransactions) {
        const { frequency, startDate, endDate, lastProcessed } = transaction.recurringConfig;
        const scheduledStartDate = new Date(startDate);
        scheduledStartDate.setHours(0, 0, 0, 0); // Normalizar a solo fecha

        if (scheduledStartDate > now) {
            continue;
        }

        if (endDate) {
            const endDateNormalized = new Date(endDate);
            endDateNormalized.setHours(0, 0, 0, 0);
            if (endDateNormalized < now) {
                transaction.recurringConfig.isActive = false;
                await transaction.save();
                continue;
            }
        }

        const shouldProcess = shouldProcessRecurring(
            lastProcessed || startDate,
            now,
            frequency
        );

        if (shouldProcess) {
            const actualTransaction = new Transaction({
                type: transaction.type,
                amount: transaction.amount,
                description: `${transaction.description} (Recurrente)`,
                category: transaction.category,
                date: now,
                isRecurring: false
            });

            await actualTransaction.save();

            transaction.recurringConfig.lastProcessed = now;
            await transaction.save();

            processed++;
        }
    }

    return processed;
}





module.exports = router;
module.exports.processRecurringTransactions = processRecurringTransactions;