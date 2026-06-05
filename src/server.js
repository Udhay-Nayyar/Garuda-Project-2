const express = require("express");
require("dotenv").config();
const transactionRoutes = require("./routes/transaction.routes");
const history = require("./routes/transaction.routes");
const { main } = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const topup = require("./routes/wallet.routes");;
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/history", history);
app.use("/api/wallet", topup);


// Start server
async function start() {
    try {

        await main();
        console.log("MongoDB Connected");

        app.listen(7000, () => {
            console.log("Server running on port 7000");
        });

    } catch (error) {

        console.log("Database connection failed");
        console.log(error.message);

    }
}

start();