const express = require('express');
const router = express.Router();
const { validateSignup, validateLogin } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    const userObj = req.body;
    try {
        validateSignup(userObj);
        const { firstName, lastName, email, password } = userObj;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword });

        await user.save();
        res.status(200).json('User addded successfully')
    } catch (e) {
        res.status(400).json({ message: 'SIGNUP FAILED', error: e.message })
    }
})

router.post('/login', async (req, res) => {
    const userObj = req.body;
    try {
        validateLogin(userObj);
        const { email, password } = userObj;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid Credentials')
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid Credentials')
        }
        const token = await user.getJwtToken();
        res.cookie('access_token', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json('Login successfully')
    } catch (e) {
        res.status(400).json({ message: 'SIGNUP FAILED', error: e.message })
    }
})

router.post('/logout', async (req, res) => {
    res.clearCookie('access_token', { httpOnly: true, secure: true, maxAge: 0 });
    res.status(200).json('Logout successfully')
})
module.exports = router;