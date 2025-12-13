const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const connectDB = require('./config/database')
const corsOptions = require('./config/cors')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
const setupWebSocket = require('./websocket/wsHandler')

const app = express()

connectDB()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.get('/test', (req, res) => {
    res.send("Hello world")
})

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

app.use('/', authRoutes)
app.use('/', userRoutes)
app.use('/', messageRoutes)

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

setupWebSocket(server)