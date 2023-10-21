const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();
const { User } = require('../models');
const authMiddleware = require('../middleware/JWTVerification');
const SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' });
        }
        // Create user
        const user = await User.create({ username, hashedPassword: password });
        res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
        // Handle potential database or Sequelize errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.message });
        }
        console.error("Error during user signup:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    // user is returned with a json web token
    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET, {
        expiresIn: '1h'
    });
    res.json({ token });
});

// all routes chronologically below this are protected by authentication
router.use(authMiddleware);

// Sample protected route
router.get('/profile', (req, res) => {
    res.json({ profile: req.user });
});

module.exports = router;