const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');
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
        
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        }).on('error', (err) => {
            console.error('Server error:', err);
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
        const { firstName, lastName, email, phone, company, message } = req.body;
        
        const contact = new Contact({
            name: `${firstName} ${lastName}`,
            email: email,
            message: `Company: ${company || 'N/A'}\nPhone: ${phone || 'N/A'}\nMessage: ${message}`
        });

        await contact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = app;
