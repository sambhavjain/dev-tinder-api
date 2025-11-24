const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const User = require('../models/User');
const { validateProfileEdit } = require('../utils/validation');

profileRouter.get('/view', userAuth, async (req, res) => {
    const user = req.user;
    res.status(200).json({ user })
})


profileRouter.patch('/edit/', userAuth, async (req, res) => {
    const user = req.user;
    const data = req.body.data;
    const userId = user._id;

    try {
       validateProfileEdit(data);
        const user = await User.findByIdAndUpdate({_id: userId}, data, { runValidators: true })
        res.status(200).json({ msg: 'User updated successfully', data: user})
        // res.status(200).json({ msg: 'User updated successfully', data: user})
    } catch (err) {
        res.status(400).send({error: err.message})
    } 
})

module.exports = profileRouter;