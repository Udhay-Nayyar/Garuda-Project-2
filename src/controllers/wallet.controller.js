const User = require('../models/user.model');
const topUp = async (req, res) => {

    const { amount } = req.body
    try {
        if (!amount || amount <= 0)
            return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });

        if (amount > 100000)   // ₹1 lakh limit per top-up (real world constraint)
            return res.status(400).json({ success: false, message: 'Max top-up is ₹1,00,000' });



        const user = await User.findByIdAndUpdate(
            req.body.id,
            { $inc: { balance: amount } },   // $inc adds to existing value atomically
            { new: true }                    // return updated doc
        );


        res.json({
            success: true,
            message: `₹${amount} added to your wallet`,
            newBalance: user.balance
        });
    } catch (err) {
        
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



module.exports = { topUp };