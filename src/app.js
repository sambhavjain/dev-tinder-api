require('dotenv').config()
const express = require('express');
const app = express()
const PORT = 4000
const connectDb = require('./config/database')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const requestRoutes = require('./routes/request')
const userRoutes = require('./routes/user')

app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use('/request', requestRoutes)
app.use('/user', userRoutes)


connectDb()
.then(() => {
    console.log('db connected')
    app.listen(PORT, () => {
    console.log('server is listening on http://localhost:'+PORT)
})
})
.catch((err) => {
    console.error('db connection err--',err)
})

