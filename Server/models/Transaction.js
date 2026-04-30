const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount:{
        type: Number,
        required: true,
        min: 0
    },
    description:{
        type:String,
        default:''
    },
    category:{
        type: String,
        default: null
    },
    date:{
        type: Date,
        default: Date.now
    },
    isRecurring:{
        type: Boolean,
        default: false
    },
    recurringConfig:{
        frequency:{
            type:String,
            enum:['daily', 'weekly', 'biweekly', 'monthly', 'yearly'],
            default: null
        },
        startDate:{
            type: Date,
            default: null
        },
        endDate:{
            type:Date,
            default: null
        },
        lastProcessed:{
            type: Date,
            default: null
        },
        isActive:{
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('transaction', transactionSchema);