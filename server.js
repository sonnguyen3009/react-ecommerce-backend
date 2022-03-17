// const express = require('express')
// const mongoose = require('mongoose')
// const morgan = require('morgan')
// const bodyParser = require('body-parser')
// const cors = require('cors')

import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import { readdirSync } from 'fs'
require('dotenv').config()

//app
const app = express()

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log('DB CONNECTION ERROR =>', err))

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '2mb' }))
app.use(cors())

// autoload routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)))

//port
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))
