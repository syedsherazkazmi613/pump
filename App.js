const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Dynamic port allocation
const PORT = process.env.PORT || 8080; // Changed from 3000 to 8080

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Try different ports if the default is busy
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                // If port is busy, try the next port
                console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
                server.listen(PORT + 1);
            } else {
                console.error('Server error:', err);
            }
        });
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
