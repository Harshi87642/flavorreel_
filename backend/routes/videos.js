const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const Video = require('../models/Video')
const { protect } = require('../middleware/auth')

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'flavorreel',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv']
  }
})

const upload = multer({ storage })

// UPLOAD VIDEO
router.post('/upload', protect, upload.single('video'), async (req, res) => {
  try {
    const { title, description, category } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Please select a video!' })
    }

    const video = await Video.create({
      title,
      description,
      category,
      videoUrl: req.file.path,
      publicId: req.file.filename,
      user: req.user._id
    })

    const populatedVideo = await Video.findById(video._id).populate('user', 'username')

    res.status(201).json(populatedVideo)
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message })
  }
})

// GET ALL VIDEOS
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}

    const videos = await Video.find(filter)
      .populate('user', 'username')
      .sort({ createdAt: -1 })

    res.json(videos)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET SINGLE VIDEO
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('user', 'username')
      .populate('comments.user', 'username')

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    res.json(video)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET VIDEOS BY USER
router.get('/user/:id', async (req, res) => {
  try {
    const videos = await Video.find({ user: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 })

    res.json(videos)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// LIKE / UNLIKE VIDEO
router.put('/:id/like', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    const isLiked = video.likes.includes(req.user._id)

    if (isLiked) {
      // Unlike
      video.likes = video.likes.filter(
        id => id.toString() !== req.user._id.toString()
      )
    } else {
      // Like
      video.likes.push(req.user._id)
    }

    await video.save()
    res.json(video)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ADD COMMENT
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    video.comments.push({
      user: req.user._id,
      text: req.body.text
    })

    await video.save()

    const updatedVideo = await Video.findById(req.params.id)
      .populate('user', 'username')
      .populate('comments.user', 'username')

    res.json(updatedVideo)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// DELETE VIDEO
router.delete('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    // Only owner can delete
    if (video.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized!' })
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' })

    await video.deleteOne()
    res.json({ message: 'Video deleted!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router