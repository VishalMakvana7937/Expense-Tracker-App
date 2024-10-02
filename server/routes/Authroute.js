const express = require('express');
const router = express.Router();
const usercontrollers = require('../controller/Authcontroller');

router.post('/register', usercontrollers.register);
router.post('/login', usercontrollers.login);

const expensecontrollers = require('../controller/Expensecontroller');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


router.post('/create-expense', expensecontrollers.addExpense);
router.post('/bulk-upload', verifyToken, upload.single('file'), expensecontrollers.bulkUpload);
router.get('/get-expense', expensecontrollers.getExpenses);
router.put('/update-expense/:id', expensecontrollers.updateExpense);
router.delete('/delete-expense/:id', expensecontrollers.deleteExpense);


module.exports = router;