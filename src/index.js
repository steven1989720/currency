require('dotenv').config({ path: './.env' })
const express = require('express');
const cors = require('cors');
const currencyRouter = require('./backend/api/currency');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './frontend/build')));

app.use(cors({
  origin: 'http://localhost:3000', // or the specific origin you want to allow
  methods: 'GET,POST',//,PUT,DELETE,OPTIONS
  allowedHeaders: 'Content-Type,Authorization',
}));

app.post('/login', (req, res) => {
  // Authenticate user...
  const user = req.body.user;

  // Generate a token
  const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' });

  // Send the token to the client
  res.json({ token });
});

// Middleware to verify the Bearer token
app.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden, invalid token
      }
      req.user = user; // Add the decoded token payload to the request
      next(); // Token is valid, proceed to the next middleware/route handler
    });
  } else {
    return res.sendStatus(401); // Unauthorized, no token provided
  }
});

// Routes
app.use('/api', currencyRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
