require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionsRouter = require('./routes/transactions');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/transactions', transactionsRouter);

//coneción a mongo y inicio de servidor
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${process.env.PORT}`);
    });

    const processRecurringTransactions = transactionsRouter.processRecurringTransactions;
    if (typeof processRecurringTransactions === 'function') {
      processRecurringTransactions().catch((err) => {
        console.error('❌ Error procesando transacciones recurrentes al iniciar:', err);
      });

      setInterval(() => {
        processRecurringTransactions().catch((err) => {
          console.error('❌ Error procesando transacciones recurrentes:', err);
        });
      }, 60 * 1000);
    }
  })
  .catch(err => {
    console.error('❌ Error al conectar MongoDB:', err);
    process.exit(1); // Detiene el servidor si no hay BD
  });

// Añade esto para ver eventos de Mongoose
mongoose.connection.on('error', err => {
  console.error('🔌 Error de conexión:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB desconectado');
});