const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Set port to 3000
const PORT = parseInt(process.env.PORT || '3000');
const MAX_PORT = 65535;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        
        // Function to try different ports
        const tryPort = (port) => {
            if (port > MAX_PORT) {
                console.error('No available ports found');
                process.exit(1);
                return;
            }

            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            }).on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is busy, trying ${port + 1}`);
                    tryPort(port + 1);
                } else {
                    console.error('Server error:', err);
                }
            });
        };

        // Start trying ports
        tryPort(PORT);
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about-us.html'));
});

app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'faq.html'));
});

app.get('/our-service', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'our-service.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// Contact API Route
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ message: 'Error submitting form' });
    }
});

module.exports = app;
