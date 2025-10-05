// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // <-- ADD THIS

const router = express.Router();

const JWT_SECRET = 'your-super-secret-key-12345'; // <-- ADD THIS

// Define the path to our users JSON file
const usersDbPath = path.join(__dirname, '../db/users.json');

// Helper function to read users from the DB
const readUsers = () => {
  const usersData = fs.readFileSync(usersDbPath);
  return JSON.parse(usersData);
};

// Helper function to write users to the DB
const writeUsers = (users) => {
  fs.writeFileSync(usersDbPath, JSON.stringify(users, null, 2));
};

// --- ROUTE: POST /api/auth/register ---
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readUsers();

    // 2. Check if user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user object
    const newUser = {
      id: Date.now(), // Simple unique ID
      email: email,
      password: hashedPassword,
    };

    // 5. Add new user and write to file
    users.push(newUser);
    writeUsers(users);

    // 6. Send success response
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readUsers();

    // 2. Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      // Use a generic error message for security
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 3. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Use the same generic error message
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 4. If credentials are correct, create a JWT payload
    const payload = {
      user: {
        id: user.id, // Include user ID in the token
      },
    };

    // 5. Sign the token
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back to the client
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;