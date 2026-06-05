const express = require('express');
const router = express.Router();
const { sendMoney, getHistory, getBalance } = require('../controllers/transaction.controller');
// const verifyToken = require('../middleware/auth.middleware');


// you should verify after wards
router.post('/send',  sendMoney);
router.get('/getHistory', getHistory);
// router.get('/topup' , getBalance);

module.exports = router;