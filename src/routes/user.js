const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');

const USER_SAFE_DATA = ['firstName', 'lastName', 'photoUrl', 'age', 'about', 'gender', 'skills']

userRouter.get('/requests/received', userAuth, async (req, res) => {
    const user = req.user;
    try {
        const connectionRequests = await ConnectionRequest.find({
            toUserId: user._id,
            status: 'interested'
        }).populate('fromUser', USER_SAFE_DATA)
        res.send(200).json({ data: connectionRequests })
    } catch(error) {
        res.status(400).json({ message: 'FAILED TO GET REQUESTS', error: error.message })
    }
})

userRouter.get('/connections', userAuth, async (req, res) => {
    const user  = req.user;
    try {
        const connectionRequests = await ConnectionRequest.find({
            $or: [{
                toUserId: user._id,
                status: 'accepted'
            }, {
                fromUserId: user._id,
                status: 'accepted'
            }]
        }).populate('fromUserId',  USER_SAFE_DATA)
        .populate('toUserId',  USER_SAFE_DATA)
        const data = connectionRequests.map(row =>{

            if(row.fromUserId.toString() === user._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.status(200).json({ data })
    } catch(err) {
        res.status(400).json({ message: 'FAILED TO GET connections', error: error.message })
    }
})

userRouter.get('/feed', userAuth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user
    try {
        const connectionRequests = await ConnectionRequest.find({
            $or: [{
                fromUserId: loggedInUser._id,
            }, {
                toUserId: loggedInUser._id,
            }]
        }).select(['fromUserId', 'toUserId'])

        const hiddenUserIds = new Set();
        connectionRequests.forEach(request => {
            hiddenUserIds.add(request.fromUserId.toString());
            hiddenUserIds.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {

                    _id: { $nin: Array.from(hiddenUserIds) }
                },
                {
                    _id: { $ne: loggedInUser._id }
                }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.status(200).json({ data: users })
        
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = userRouter