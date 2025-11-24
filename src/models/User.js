const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    lastName:{
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return validator.isEmail(v);
            },
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
        validate: {
            validator: function(v) {
                return validator.isStrongPassword(v);
            },
            message: 'Password is not strong'
        }

    },
    age :{
        type: Number,
        min: 18,
        max: 100
    },
    gender :{
        type: String,
        enum: ['male', 'female', 'other']
    },
    photoUrl: {
        type: String,
        default: 'https://avatar.iran.liara.run/username?username=Sambhav+Jain',
        validate: {
            validator: function(v) {
                return validator.isURL(v);
            },
            message: 'Invalid photo URL'
        }
    },
    about: {
        type: String,
        default: 'This is a default about section',
        maxlength: 255,
    },
    skills: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.length <=10;
            },
            message: 'Skills must be less than 10'
        }
    }
},{ timestamps: true })

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getJwtToken = async function() {
    const token = await jwt.sign({ _id: this._id}, "DEV_TINDER_SECRET_KEY", { expiresIn: '24h' })
    return token;
}


const User = mongoose.model('User', userSchema)

module.exports = User