const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount cannot be negative"]

    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
},
{
timestamps: true
})
module.exports = mongoose.model("Transaction", transactionSchema)

