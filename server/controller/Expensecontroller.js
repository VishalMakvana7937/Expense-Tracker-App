const Expense = require('../models/Expensemodel');
const fs = require('fs');

const addExpense = async (req, res) => {
    const { amount, category, paymentMethod } = req.body;

    try {
        const expense = new Expense({ amount, category, paymentMethod });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const bulkUpload = (req, res) => {
    const expenses = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
            expenses.push({
                amount: parseFloat(row.amount),
                category: row.category,
                paymentMethod: row.paymentMethod
            });
        })
        .on('end', async () => {
            try {
                await Expense.insertMany(expenses);
                res.status(201).json({ message: "Expenses uploaded successfully" });
            } catch (error) {
                res.status(400).json({ error: error.message });
            } finally {
                // Cleanup uploaded file
                fs.unlinkSync(req.file.path);
            }
        });
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });
        res.json(updatedExpense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        await Expense.findByIdAndDelete(id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addExpense,
    bulkUpload,
    getExpenses,
    updateExpense,
    deleteExpense
};
