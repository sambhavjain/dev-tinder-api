const mongoose = require('mongoose')

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://sambhavjain1501_db_user:mCnL1lFRb0f30PAY@cluster0.nmnjfxy.mongodb.net/DevTinder')
}

module.exports = connectDb