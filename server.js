const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()

app.use(express.json())
app.use(morgan('dev'))

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to db')
    } catch (err) {
        console.log(err)
    }
}

connectToDb()

app.use('/auth', require('./routes/authRouter'))

app.use((err, req, res, next) => {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        res.status(err.status)
    }
    return res.send({ errMsg: err.message })
})

app.listen(process.env.PORT, () => console.log('server is running on ', process.env.PORT))