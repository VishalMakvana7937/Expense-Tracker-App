const mongoose = require("mongoose");

const URI = 'mongodb://127.0.0.1/Expenses';

const connectDB = async () => { // Fixing the typo here
    try {
        await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connection successful to database');
    } catch (error) {
        console.error('Connection to database failed:', error);
    }
};

module.exports = connectDB;
