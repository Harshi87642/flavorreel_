import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  const categories = ['All', 'Indian', 'Italian', 'Chinese', 'Desserts', 'Quick Meals', 'Breakfast', 'Street Food']

  useEffect(() => {
    fetchVideos()
  }, [category])

  const fetchVideos = async () => {
    try {
      const url = category === 'All'
        ? 'http://localhost:5000/api/videos'
        : `http://localhost:5000/api/videos?category=${category}`
      const res = await axios.get(url)
      setVideos(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      {/* Category pills */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px 24px',
        overflowX: 'auto',
        borderBottom: '1px solid #eeeeee',
        background: '#ffffff'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: category === cat ? '#D85A30' : '#dddddd',
              background: category === cat ? '#D85A30' : '#ffffff',
              color: category === cat ? '#fff' : '#666',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          Loading videos...
        </div>
      )}

      {/* Empty state */}
      {!loading && videos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍳</div>
          <h3 style={{ color: '#1a1a1a', marginBottom: '8px' }}>No videos yet!</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>Be the first to upload a cooking video.</p>
        </div>
      )}

      {/* Video grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        padding: '24px'
      }}>
        {videos.map(video => (
          <Link to={`/watch/${video._id}`} key={video._id} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #eeeeee',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.2s',
              cursor: 'pointer'
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(216,90,48,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', aspectRatio: '16/9', background: '#f0f0f0' }}>
                <video
                  src={video.videoUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  muted
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.15)'
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(216,90,48,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ marginLeft: '3px', fontSize: '14px', color: '#fff' }}>▶</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '12px' }}>
                <h3 style={{
                  fontSize: '14px', fontWeight: '600',
                  color: '#1a1a1a', marginBottom: '6px', lineHeight: '1.3'
                }}>
                  {video.title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link
                    to={`/profile/${video.user?._id}`}
                    onClick={e => e.stopPropagation()}
                    style={{ fontSize: '13px', color: '#D85A30' }}
                  >
                    👤 {video.user?.username}
                  </Link>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    ♥ {video.likes?.length || 0}
                  </span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span style={{
                    fontSize: '11px', padding: '3px 8px',
                    background: '#fff4f0', borderRadius: '20px',
                    color: '#D85A30', border: '1px solid #fde0d6'
                  }}>
                    {video.category}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home