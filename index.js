const express = require('express');
const dotenv = require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');

const app = express()
//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('db connected'))
.catch((err) => console.log('db not connected', err))

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use('/', require('./routes/authRoute'))
app.use('/', require('./routes/profileRoute'))



const port = 7000;
app.listen (port, () => console.log(`Server is running on port ${port}`))