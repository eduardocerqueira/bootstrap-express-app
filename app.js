const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for serving static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true in production
}));

// Login page route
app.get('/', (req, res) => {
    if (req.session.username) {
        return res.redirect('/main');
    }
    res.render('login');
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        req.session.username = username;
        return res.redirect('/main');
    }
    res.render('login', { error: 'Please enter a valid name.' });
});

// Main page route (requires login)
app.get('/main', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/');
    }
    res.render('main', { username: req.session.username });
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
