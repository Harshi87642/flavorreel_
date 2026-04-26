import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Indian')
  const [videoFile, setVideoFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const categories = ['Indian', 'Italian', 'Chinese', 'Desserts', 'Quick Meals', 'Breakfast', 'Street Food']

  // Redirect if not logged in
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔐</div>
        <h3 style={{ color: '#fff', marginBottom: '8px' }}>Please login first!</h3>
        <a href="/login" style={{ color: '#D85A30' }}>Go to Login</a>
      </div>
    )
  }

  const handleUpload = async () => {
    if (!title || !videoFile) {
      setError('Please add a title and select a video!')
      return
    }
    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('video', videoFile)

    try {
      await axios.post('https://flavorreel-backend.onrender.com/api/videos/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percent)
        }
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Try again!')
      setUploading(false)
    }
  }

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
          Upload your recipe 🍳
        </h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>
          Share your cooking with the FlavorReel community
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: '#3a1a1a', color: '#ff6b6b',
            padding: '12px 16px', borderRadius: '8px',
            fontSize: '13px', marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Video file picker */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '8px' }}>
            Video file *
          </label>
          <div style={{
            border: '2px dashed #333',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            background: videoFile ? '#1a2a1a' : '#1a1a1a',
            borderColor: videoFile ? '#4caf50' : '#333'
          }}
            onClick={() => document.getElementById('videoInput').click()}
          >
            {videoFile ? (
              <>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                <p style={{ color: '#4caf50', fontSize: '14px', fontWeight: '500' }}>
                  {videoFile.name}
                </p>
                <p style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                  {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎬</div>
                <p style={{ color: '#888', fontSize: '14px' }}>
                  Click to select your cooking video
                </p>
                <p style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>
                  MP4, MOV, AVI supported
                </p>
              </>
            )}
          </div>
          <input
            id="videoInput"
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={e => setVideoFile(e.target.files[0])}
          />
        </div>

        {/* Title */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '6px' }}>
            Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Homemade Biryani from scratch"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px',
              background: '#1a1a1a', border: '1px solid #333',
              borderRadius: '8px', color: '#fff', fontSize: '14px'
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '6px' }}>
            Description (ingredients, steps, tips...)
          </label>
          <textarea
            placeholder="Share your recipe details here..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: '10px 14px',
              background: '#1a1a1a', border: '1px solid #333',
              borderRadius: '8px', color: '#fff', fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '6px' }}>
            Category
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px',
              background: '#1a1a1a', border: '1px solid #333',
              borderRadius: '8px', color: '#fff', fontSize: '14px'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Progress bar */}
        {uploading && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#aaa' }}>Uploading...</span>
              <span style={{ fontSize: '13px', color: '#D85A30' }}>{progress}%</span>
            </div>
            <div style={{ background: '#2a2a2a', borderRadius: '4px', height: '6px' }}>
              <div style={{
                width: `${progress}%`, height: '100%',
                background: '#D85A30', borderRadius: '4px',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            width: '100%', padding: '14px',
            background: uploading ? '#555' : '#D85A30',
            color: '#fff', border: 'none',
            borderRadius: '8px', fontSize: '15px',
            fontWeight: '600', cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? `Uploading... ${progress}%` : '🎬 Upload Video'}
        </button>

      </div>
    </div>
  )
}

export default Upload