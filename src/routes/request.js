const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/ConnectionRequest');
const { validateConnectionRequest, validateReviewConnectionRequest } = require('../utils/validation');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

requestRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    try {
        validateConnectionRequest({status, toUserId});
        //check if the touser exists
        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error('User not found')
        }
        //check if the receiver has already sent a request to the user
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        })
        if(existingRequest){
            throw new Error('Request already exists')
        }
        
        const connectionRequest = new ConnectionRequest({
            fromUserId: user._id,
            toUserId: toUserId,
            status: status
        })
        const savedConnectionRequest = await connectionRequest.save();

        const emailResponse = await sendEmail.run(toUser.email, 'sambhav@sambhav.space');
        console.log(emailResponse);
        res.status(200).json({ savedConnectionRequest })
    } catch (error) {
        res.status(400).json({ message: 'FAILED TO SEND INTERESTED REQUEST', error: error.message })
    }
    
})

requestRouter.post('/review/:status/:requestId', userAuth, async (req, res) => {
    const user = req.user;
    const requestId = req.params.requestId;
    const status = req.params.status;
    try {
        //status cannot be outside the accept , rejected
        validateReviewConnectionRequest({status, requestId});
        const connectionRequest = await ConnectionRequest.findOne({_id: requestId,
            toUserId: user._id,
            status: 'interested'
        })
        //requestId must be valid
        if(!connectionRequest) {
            throw new Error('Request not found')
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();   
        res.status(200).json({ msg: 'Request reviewed successfully', data})
    } catch (error) {
        res.status(400).json({ message: 'FAILED TO REVIEW REQUEST', error: error.message })
    }
})

module.exports = requestRouter;