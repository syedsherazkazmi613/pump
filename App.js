const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Contact = require('./models/Contact');
const auth = require('./middleware/auth');
require('dotenv').config();

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add this helper function to check if user is authenticated
app.use((req, res, next) => {
    res.locals.isAuthenticated = !!req.cookies.token;
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Validation
        if (password !== confirmPassword) {
            return res.render('register', {
                error: 'Passwords do not match',
                success: null,
                isAuthenticated: false
            });
        }

        // Check if username exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.render('register', {
                error: 'Username already taken',
                success: null,
                isAuthenticated: false
            });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.render('login', {
            error: null,
            success: 'Registration successful! Please login.',
            isAuthenticated: false
        });
    } catch (error) {
        res.render('register', {
            error: 'Registration failed',
            success: null,
            isAuthenticated: false
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.render('login', {
                error: 'Invalid email or password',
                success: null,
                isAuthenticated: false
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        res.render('login', {
            error: 'Login failed',
            success: null,
            isAuthenticated: false
        });
    }
});

app.get('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// Protected Routes
app.get('/contact', auth, (req, res) => {
    res.render('contact');
});

// Serve HTML files for each route
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about-us', (req, res) => {
    res.render('about-us');
});

app.get('/faq', (req, res) => {
    res.render('faq');
});

app.get('/login', (req, res) => {
    res.render('login', { 
        error: req.query.error,
        success: req.query.success,
        isAuthenticated: res.locals.isAuthenticated 
    });
});

app.get('/register', (req, res) => {
    res.render('register', { 
        error: req.query.error,
        success: req.query.success,
        isAuthenticated: res.locals.isAuthenticated 
    });
});
app.get('/our-service', (req, res) => {
    res.render('our-service');
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
