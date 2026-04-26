import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [comment, setComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchVideo()
  }, [id])

  const fetchVideo = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/videos/${id}`)
      setVideo(res.data)
      setLikesCount(res.data.likes?.length || 0)
      if (user) {
        setLiked(res.data.likes?.includes(user._id))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleLike = async () => {
    if (!token) return alert('Please login to like!')
    try {
      const res = await axios.put(
        `http://localhost:5000/api/videos/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLiked(!liked)
      setLikesCount(res.data.likes.length)
    } catch (err) {
      console.log(err)
    }
  }

  const handleComment = async () => {
    if (!token) return alert('Please login to comment!')
    if (!comment.trim()) return
    try {
      await axios.post(
        `http://localhost:5000/api/videos/${id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setComment('')
      fetchVideo()
    } catch (err) {
      console.log(err)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard! Share it with friends 🍳')
  }

  if (!video) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      Loading video...
    </div>
  )

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>

        {/* Video player */}
        <video
          src={video.videoUrl}
          controls
          style={{
            width: '100%',
            borderRadius: '12px',
            background: '#000',
            maxHeight: '500px'
          }}
        />

        {/* Title */}
        <h1 style={{
          fontSize: '20px', fontWeight: '700',
          color: '#fff', margin: '16px 0 6px'
        }}>
          {video.title}
        </h1>

        {/* Views and date */}
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
          {new Date(video.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>

        {/* Chef info + actions */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid #2a2a2a'
        }}>
          <Link to={`/profile/${video.user?._id}`} style={{
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: '#D85A30', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '16px', color: '#fff'
            }}>
              {video.user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '15px', color: '#fff' }}>
                {video.user?.username}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>Chef</div>
            </div>
          </Link>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleLike} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '8px',
              border: '1px solid',
              borderColor: liked ? '#D85A30' : '#333',
              background: liked ? '#D85A30' : 'transparent',
              color: '#fff', fontSize: '14px', cursor: 'pointer'
            }}>
              {liked ? '♥' : '♡'} {likesCount}
            </button>
            <button onClick={handleShare} style={{
              padding: '8px 18px', borderRadius: '8px',
              border: '1px solid #333',
              background: 'transparent',
              color: '#fff', fontSize: '14px', cursor: 'pointer'
            }}>
              ↗ Share
            </button>
          </div>
        </div>

        {/* Description */}
        {video.description && (
          <div style={{
            background: '#1a1a1a', borderRadius: '10px',
            padding: '14px', margin: '16px 0',
            fontSize: '14px', color: '#ccc', lineHeight: '1.6'
          }}>
            {video.description}
          </div>
        )}

        {/* Category tag */}
        <div style={{ margin: '12px 0 24px' }}>
          <span style={{
            padding: '5px 14px', borderRadius: '20px',
            background: '#2a2a2a', color: '#D85A30',
            fontSize: '13px', fontWeight: '500'
          }}>
            {video.category}
          </span>
        </div>

        {/* Comments section */}
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
          Comments ({video.comments?.length || 0})
        </h3>

        {/* Comment input */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment..."
            onKeyDown={e => e.key === 'Enter' && handleComment()}
            style={{
              flex: 1, padding: '10px 14px',
              background: '#1a1a1a', border: '1px solid #333',
              borderRadius: '8px', color: '#fff', fontSize: '14px'
            }}
          />
          <button onClick={handleComment} style={{
            padding: '10px 20px', background: '#D85A30',
            color: '#fff', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: '500'
          }}>
            Post
          </button>
        </div>

        {/* Comments list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {video.comments?.length === 0 && (
            <p style={{ color: '#666', fontSize: '14px' }}>
              No comments yet. Be the first to comment! 👇
            </p>
          )}
          {video.comments?.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: '#D85A30', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '13px',
                color: '#fff', flexShrink: 0
              }}>
                {c.user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
                  {c.user?.username}
                </span>
                <p style={{ fontSize: '14px', color: '#ccc', marginTop: '3px', lineHeight: '1.4' }}>
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Watch