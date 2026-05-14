const express = require('express');
const router = express.Router();
const Bx = require('../models/Box');
const Box = require('../models/Box');

//Obtener todas las cajas
router.get('/', async (req, res) => {
    try {
        const boxes = await Box.find().sort({ createdAt: -1 });

        //Calcular rendimiento para cada caja
        const boxesWithProfit = boxes.map(box => {
            const monthsPassed = getMonthPassed(box.startDate);
            const monthlyRate = (box.interestRate / 100) / 12;
            const projectedAmount = box.initialAmount * Math.pow(1 + monthlyRate, monthsPassed);
            const profit = projectedAmount - box.initialAmount;

            return{
                ...box.toObject(),
                projectedAmount: Math.round(projectedAmount),
                profit: Math.round(profit),
                monthsPassed
            };
        });
        res.json(boxesWithProfit);
    } catch (error){
        res.status(500).json({ message: 'Error al obtener cajas', error});
    }
});

//Obtener una caja específicia
router.get('/:id', async (req, res) => {
    try {
        const box = await Box.findById(req.params.id);
        if (!box){
            return res.status(404).json({ message: 'Caja no ncontrada' });
        }
        re.json(box);
    } catch (error){
        res.status(500).json({ message: 'error al obtener caja', error });
    }
});

//Crear una nueva caja
ruter.post('/', async (req, res) => {
    try{
        const {name, description, type, initialAmount, interestRate, startDate, endDate, color } = req.body;

        if(!name || initialAmount === undefined) {
            return res.status(400).json({ message: 'Se requiere nombre y monto inicial' });
        }

        const box = new Box({
            name,
            description: description || '',
            type: type || 'other',
            initialAmount,
            currentAmount: initialAmount,
            interestRate: interestRate || 0,
            startDate: startDate || new Date(),
            endDate: endDate || null,
            color: color || '#007bff'
        });

        await box.save();
        res.status(201).json(box);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear caja', error })
    }
});

//Actualizar una caja
router.put('/:id', async (req, res) => {
    try{
        const { currentAmount, name, description, interestRate, isActive, color } = req.body;

        const box = await Box.findById(req.params.id);
        if(!box){
            return res.status(404).json({ message: 'Caja no encontrada' })
        }

        if(currentAmount !== undefined) box.currentAmount = currentAmount;
        if(name) box.name = name;
        if(description !== undefined) box.description = description;
        if(interestRate !== undefined) box.interestRate = interestRate;
        if(isActive !== undefined) box.isActive = isActive;
        if(color) box.color = color;

        await box.save();
        res.json(box);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar caja', error });
    }
});

//Agregar dinero a una caja
router.post('/:id/deposit', async (req, res) => {
    try{
        const { amount } = req.body;

        if(!amount || amount <= 0){
            return res.status(400).json({ message: 'Monto inválido' });
        }

        const box = await Box.findById(req.params.id);
        if(!box){
            return res.status(404).json({ message: 'Caja no encontrada' });
        }

        box.currentAmount += amount;
        await box.save();

        res.json(box);
    } catch (error) {
        res.status(500).json({ message: 'Error al depositar', error });
    }
});

// Retirar dinero de una caja
router.post('/:id/withdraw', async (req, res) => {
    try{
        const { amount } = req.body;

        if(!amount || amount <= 0){
            return res.status(400).json({ message: 'Monto invalido' });
        }

        const box = await Box.findById(req.params.id);
        if(!box){
            return res.status(404).json({ message: 'Caja no encontrada' });
        }

        if(amount > box.currentAmount){
            return res.status(400).json({ message: 'Fondos Insuficientes' });
        }

        box.currentAmount -= amount;
        await box.save();

        res.json(box);
    } catch (error) {
        res.status(500).json({ message: 'Error al retirar', error });
    }
});

//Eliminar una caja
router.delete('/:id', async (req, res) => {
    try{
        const box = await Box.findByIdAndDelete(req.params.id);
        if(!box){
            return res.status(404).json({ message: 'Caja no eonctrada' });
        }
        res.json({message: 'Caja eliminada correctamente' });
    }catch (error) {
        res.status(500).json({ message: 'Error al eliminar caja', error})
    }
});

function getMonthPassed(startDate){
    const now = new Date();
    const start = new Date(startDate);
    return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
}

module.exports = router;