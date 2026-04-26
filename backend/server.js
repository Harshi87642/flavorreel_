const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/auth')
const videoRoutes = require('./routes/videos')

app.use('/api/auth', authRoutes)
app.use('/api/videos', videoRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🍳 FlavorReel backend is running!' })
})

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!')
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error:', err)
  })