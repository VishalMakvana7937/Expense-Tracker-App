import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Card,
    Typography,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Grid,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PublicIcon from '@mui/icons-material/Public';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const styles = {
    container: {
        padding: '30px',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    totalExpenses: {
        fontSize: '30px',
        fontWeight: '600',
        color: '#d32f2f',
        marginTop: '10px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    },
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        marginBottom: '10px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    },
    cardIcon: {
        marginRight: '10px',
        color: '#d32f2f'
    },
    uploadButton: {
        marginTop: '15px',
        backgroundColor: '#1976d2',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#155a9a'
        }
    },
    addExpenseButton: {
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#c51162'
        }
    },
    deleteButton: {
        backgroundColor: '#ff1744',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#d50000'
        }
    },
};

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        paymentMethod: '',
        id: '' // For holding the ID of the expense being edited
    });
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [file, setFile] = useState(null); // For file upload

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await fetch('http://localhost:5000/get-expense');
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            const data = await response.json();
            setExpenses(data);
            calculateTotal(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const calculateTotal = (data) => {
        const total = data.reduce((acc, exp) => acc + exp.amount, 0);
        setTotalExpenses(total);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = formData.id ? `http://localhost:5000/update-expense/${formData.id}` : 'http://localhost:5000/create-expense';
            const method = formData.id ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: formData.amount,
                    category: formData.category,
                    paymentMethod: formData.paymentMethod
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add/update expense');
            }

            const updatedExpense = await response.json();

            if (formData.id) {
                // Update existing expense
                const updatedExpenses = expenses.map(exp => exp._id === updatedExpense._id ? updatedExpense : exp);
                setExpenses(updatedExpenses);
            } else {
                // Add new expense
                setExpenses([...expenses, updatedExpense]);
            }

            calculateTotal([...expenses, updatedExpense]);
            setFormData({ amount: '', category: '', paymentMethod: '', id: '' }); // Reset form
        } catch (error) {
            console.error('Error adding/updating expense:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/delete-expense/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete expense');
            }
            const updatedExpenses = expenses.filter(exp => exp._id !== id);
            setExpenses(updatedExpenses);
            calculateTotal(updatedExpenses);
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleEdit = (expense) => {
        setFormData({
            amount: expense.amount,
            category: expense.category,
            paymentMethod: expense.paymentMethod,
            id: expense._id // Set the ID for the expense to update
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/bulk-upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload CSV');
            }
            // After successful upload, refresh the expenses
            await fetchExpenses();
            setFile(null); // Reset file input
        } catch (error) {
            console.error('Error uploading CSV:', error);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Dentist Appointment':
                return <LocalHospitalIcon />;
            case 'Travelling':
                return <PublicIcon />;
            case 'Groceries':
                return <FastfoodIcon />;
            case 'Utilities':
                return <ElectricalServicesIcon />;
            case 'Rent':
                return <HomeIcon />;
            case 'Entertainment':
                return <MovieIcon />;
            case 'Health':
                return <HealthAndSafetyIcon />;
            default:
                return <PublicIcon />;
        }
    };

    return (
        <Box sx={styles.container}>
            <Box sx={styles.header}>
                <Typography variant="h4" component="h1">
                    Expense Management
                </Typography>
                <Typography sx={styles.totalExpenses}>
                    Total Expenses: ${totalExpenses}
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left side - Form */}
                <Grid item xs={12} md={4}>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <TextField
                            label="Expense Amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Select Category</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="Dentist Appointment">Dentist Appointment</MenuItem>
                                <MenuItem value="Travelling">Travelling</MenuItem>
                                <MenuItem value="Groceries">Groceries</MenuItem>
                                <MenuItem value="Utilities">Utilities</MenuItem>
                                <MenuItem value="Rent">Rent</MenuItem>
                                <MenuItem value="Entertainment">Entertainment</MenuItem>
                                <MenuItem value="Health">Health</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Select Payment Method</InputLabel>
                            <Select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="Cash">Cash</MenuItem>
                                <MenuItem value="Card">Card</MenuItem>
                                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                <MenuItem value="PayPal">PayPal</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={styles.addExpenseButton}
                            startIcon={<AddIcon />}
                            fullWidth
                        >
                            {formData.id ? 'Update Expense' : 'Add Expense'}
                        </Button>
                    </form>

                    {/* File Upload Section */}
                    <form onSubmit={handleUpload} style={styles.form}>
                        <input type="file" onChange={handleFileChange} required />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={styles.uploadButton}
                            startIcon={<UploadFileIcon />}
                            fullWidth
                        >
                            Upload CSV
                        </Button>
                    </form>
                </Grid>

                {/* Right side - Expenses List */}
                <Grid item xs={12} md={8}>
                    <Divider sx={{ marginBottom: '20px' }} />
                    <Box>
                        {expenses.map(expense => (
                            <Card key={expense._id} sx={styles.card}>
                                <Box display="flex" alignItems="center">
                                    <Box sx={styles.cardIcon}>
                                        {getCategoryIcon(expense.category)}
                                    </Box>
                                    <Typography variant="body1">
                                        {expense.category}: ${expense.amount}
                                    </Typography>
                                </Box>
                                <Box>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(expense)} // Set the expense to edit
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(expense._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default App;
