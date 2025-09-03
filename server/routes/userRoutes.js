const express = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../models/UserModel');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '3d' });
};
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const user = await User.signup(username, password, email);

        const token = createToken(user._id);
        res.status(201).json({ user , token});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;