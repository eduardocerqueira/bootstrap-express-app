const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const requestIp = require('request-ip'); // Middleware for getting IP addresses

const app = express();
// Export app for testing
module.exports = app;

// Store logged-in users with their username and IP address
const loggedInUsers = {};

// Set view engine
app.set('view engine', 'ejs');

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for serving static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to capture IP address
app.use(requestIp.mw());

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
    const localTime = new Date().toLocaleString();

    if (username) {
        req.session.username = username;

        // Add the user to the list of logged-in users
        loggedInUsers[username] = { username, localTime };
        return res.redirect('/main');
    }

    res.render('login', { error: 'Please enter a valid name.' });
});

// API to get the list of logged-in users
app.get('/api/users', (req, res) => {
    res.json(Object.values(loggedInUsers)); // Return the users as an array of objects
    console.log(loggedInUsers)
});

// Main page route (requires login)
app.get('/main', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/');
    }

    // Pass the list of logged-in users to the main page
    res.render('main', { username: req.session.username, users: loggedInUsers });
});

// Logout route
app.post('/logout', (req, res) => {
    const username = req.session.username;

    // Remove the user from the logged-in users list
    if (username) {
        delete loggedInUsers[username];
    }

    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
    }
  });
