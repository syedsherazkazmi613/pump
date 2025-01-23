const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Security and optimization middleware with relaxed CSP for development
app.use(helmet({
    contentSecurityPolicy: false  // Temporarily disable CSP for development
}));
app.use(compression());

// Serve static files with proper MIME types
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));

// HTML Routes
const sendHtml = (fileName) => (req, res) => {
    res.sendFile(path.join(__dirname, 'views', `${fileName}.html`));
};

app.get('/', sendHtml('index'));
app.get('/about-us', sendHtml('about-us'));
app.get('/faq', sendHtml('faq'));
app.get('/our-service', sendHtml('our-service'));
app.get('/contact', sendHtml('contact'));
app.get('/terms', sendHtml('terms'));
app.get('/privacy', sendHtml('privacy'));

// Contact API Route
app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, company, description, contactType } = req.body;
        
        const contact = new Contact({
            name: `${firstName} ${lastName}`,
            email: email,
            message: `Type: ${contactType}\nCompany: ${company || 'N/A'}\nPhone: ${phone || 'N/A'}\nMessage: ${description || 'Calendly booking request'}`
        });

        await contact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

// // Error handling
// app.use((req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).sendFile(path.join(__dirname, 'views', ''));
// });

module.exports = app;
