const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered!' })
    }

    // Check if username taken
    const usernameTaken = await User.findOne({ username })
    if (usernameTaken) {
      return res.status(400).json({ message: 'Username already taken!' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET USER PROFILE
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// FOLLOW / UNFOLLOW
router.put('/follow/:id', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id)
    const currentUser = await User.findById(req.user._id)

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Can't follow yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't follow yourself!" })
    }

    const isFollowing = currentUser.following.includes(req.params.id)

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      )
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user._id.toString()
      )
    } else {
      // Follow
      currentUser.following.push(req.params.id)
      userToFollow.followers.push(req.user._id)
    }

    await currentUser.save()
    await userToFollow.save()

    res.json({ message: isFollowing ? 'Unfollowed' : 'Followed' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router