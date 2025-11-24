const jwt = require('jsonwebtoken')
const User = require('../models/User')

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        console.log({token})
        if(!token){
            throw new Error('Unauthorized')
        }
        const decoded = jwt.verify(token, "DEV_TINDER_SECRET_KEY")
        if(!decoded){
            throw new Error('Unauthorized')
        }
        console.log({decoded})
        const user = await User.findById(decoded._id)
        if(!user){
            throw new Error('Invalid user')
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(400).json({ message: 'Unauthorized', error: err.message })
    }
}
module.exports = { userAuth }