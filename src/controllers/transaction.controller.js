const mongoose = require('mongoose');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

const sendMoney = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const {
            receiverEmail,
            amount: rawAmount,
            description
        } = req.body;

        const amount = Number(rawAmount);
        const senderId = req.body.id;

        // Validation
        if (!receiverEmail || !amount) {
            throw new Error("receiverEmail and amount are required");
        }

        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        // Find users
        const sender = await User.findById(senderId).session(session);

        if (!sender) {
            throw new Error("Sender not found");
        }

        const receiver = await User.findOne({
            email: receiverEmail
        }).session(session);

        if (!receiver) {
            throw new Error("Receiver not found");
        }

        // Prevent self transfer
        if (sender._id.toString() === receiver._id.toString()) {
            throw new Error("Cannot send money to yourself");
        }

        // Balance check
        if (sender.balance < amount) {
            throw new Error("Insufficient balance");
        }

        // Update balances
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save({ session });
        await receiver.save({ session });

        // Create transaction records
        const txnRef = `TXN${Date.now()}`;

        await Transaction.create(
            [
                {
                    sender: sender._id,
                    receiver: receiver._id,
                    amount,
                    type: "debit",
                    status: "completed",
                    description:
                        description || `Transfer to ${receiver.name}`,
                    reference: txnRef + "_D"
                },
                {
                    sender: sender._id,
                    receiver: receiver._id,
                    amount,
                    type: "credit",
                    status: "completed",
                    description:
                        description || `Received from ${sender.name}`,
                    reference: txnRef + "_C"
                }
            ],
            { session, ordered: true }
        );

        // Commit transaction
        await session.commitTransaction();

        // Email notification can be added here
        const { sendTransactionEmail } = require('../config/email');
        sendTransactionEmail({ to: sender.email, name: sender.name, type: 'debit', amount, balance: sender.balance }).catch(console.error);
        sendTransactionEmail({ to: receiver.email, name: receiver.name, type: 'credit', amount, balance: receiver.balance }).catch(console.error);


        res.status(200).json({
            success: true,
            message: `₹${amount} sent to ${receiver.name}`,
            balance: sender.balance
        });

    } catch (err) {

        await session.abortTransaction();

        res.status(400).json({
            success: false,
            message: err.message
        });

    } finally {

        session.endSession();

    }
};


const getHistory = async (req, res) => {

    try {

        const userId = req.body.id;
        console.log("User ID from token:", userId);

        
        const transactions = await Transaction.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        });

        res.status(200).json({
            success: true,
            transactions
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    sendMoney,
    getHistory
};
