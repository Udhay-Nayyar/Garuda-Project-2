const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendTransactionEmail = async ({ to, name, type, amount, balance }) => {
    const subject = type === 'debit'
        ? `Money Sent: ₹${amount} debited from your account`
        : `Money Received: ₹${amount} credited to your account`;

    const html = `
      <div style='font-family:Arial;max-width:500px;'>
        <h2 style='color:#1A56DB;'>Transaction Alert</h2>
        <p>Hi ${name},</p>
        <p>${type === 'debit' ? '₹' + amount + ' was sent from' : '₹' + amount + ' was added to'} your wallet.</p>
        <p><strong>Updated Balance:</strong> ₹${balance}</p>
        <p style='color:#888;'>If you did not initiate this, contact support immediately.</p>
      </div>
    `;
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

module.exports = { sendTransactionEmail };