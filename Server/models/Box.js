const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        default: ''
    },
    type:{
        type: String,
        enum: ['cdt', 'investment', 'savings', 'other'],
        default:'other'
    },
    initialAmount:{
        type: Number,
        required: true,
        min: 0
    },
    currentAmount:{
        type: Number,
        required: true,
        min: 0
    },
    interestRate:{
        type: Number,
        defualt: 0,
        min: 0 //Porcentaje anuaal
    },
    startDate:{
        type: FormDataEvent,
        default: Date.now
    },
    endDate:{
        type: Date,
        default: null
    },
    isActive:{
        type: Boolean,
        default: true
    },
    color:{
        type: String,
        default: '#007bff' // Azul por defecto
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Box', boxSchema);