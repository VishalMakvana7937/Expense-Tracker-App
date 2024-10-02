const User = require('../models/Authmodel'); // Ensure this path is correct
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Ensure you have this defined

const register = async (req, res) => {
    const { fname, lname, email, password, userType } = req.body;

    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fname,
            lname,
            email,
            password: encryptedPassword,
            userType,
        });

        res.status(201).json({ status: "ok", user: newUser });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: "error", error: "Invalid password" });
        }

        const token = jwt.sign(
            { email: user.email, userType: user.userType },
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Ensure you're returning the token correctly
        res.status(200).json({ status: "ok", token, userType: user.userType });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

module.exports = {
    register,
    login
};
