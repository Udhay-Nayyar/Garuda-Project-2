const User = require("../models/user.model");


// Register
const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.send("User already exists");
        }

        const user = await User.create({
            name,
            email,
            password
        });

        res.json({
            message: "Registration successful",
            user
        });

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


// Login
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.send("Invalid email");
        }

        const match = await user.comparePassword(password);

        if (!match) {
            return res.send("Wrong password");
        }

        res.json({
            message: "Login successful"
        });

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


// Logout
const logout = (req, res) => {

    res.json({
        message: "Logged out"
    });

};


module.exports = {
    register,
    login,
    logout
};