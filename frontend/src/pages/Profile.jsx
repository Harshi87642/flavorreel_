import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function Profile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const isOwnProfile = user?._id === id

  useEffect(() => {
    fetchProfile()
    fetchUserVideos()
  }, [id])

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/user/${id}`)
      setProfile(res.data)
      if (user) {
        setIsFollowing(res.data.followers?.includes(user._id))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchUserVideos = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/videos/user/${id}`)
      setVideos(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleFollow = async () => {
    if (!token) return alert('Please login to follow!')
    try {
      await axios.put(
        `http://localhost:5000/api/auth/follow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIsFollowing(!isFollowing)
      fetchProfile()
    } catch (err) {
      console.log(err)
    }
  }

  if (!profile) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
      Loading profile...
    </div>
  )

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Profile header */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid #2a2a2a',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: '#D85A30', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: '700', color: '#fff',
              flexShrink: 0
            }}>
              {profile.username?.[0]?.toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                {profile.username}
              </h2>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '14px' }}>
                @{profile.username.toLowerCase()}
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                    {videos.length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Videos</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                    {profile.followers?.length || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Followers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                    {profile.following?.length || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Following</div>
                </div>
              </div>
            </div>

            {/* Follow button */}
            {!isOwnProfile && (
              <button onClick={handleFollow} style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFollowing ? '#444' : '#D85A30',
                background: isFollowing ? 'transparent' : '#D85A30',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Videos section */}
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
          {isOwnProfile ? 'My Videos' : `${profile.username}'s Videos`} ({videos.length})
        </h3>

        {/* Empty state */}
        {videos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍳</div>
            <p style={{ color: '#888', fontSize: '14px' }}>
              {isOwnProfile ? 'You haven\'t uploaded any videos yet!' : 'No videos uploaded yet.'}
            </p>
            {isOwnProfile && (
              <Link to="/upload" style={{
                display: 'inline-block', marginTop: '16px',
                padding: '10px 24px', background: '#D85A30',
                color: '#fff', borderRadius: '8px', fontSize: '14px'
              }}>
                Upload your first video
              </Link>
            )}
          </div>
        )}

        {/* Video grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {videos.map(video => (
            <Link to={`/watch/${video._id}`} key={video._id} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #2a2a2a',
                cursor: 'pointer'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#D85A30'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#2a2a2a' }}>
                  <video
                    src={video.videoUrl}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)'
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'rgba(216,90,48,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ marginLeft: '3px', fontSize: '12px' }}>▶</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                    {video.title}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    ♥ {video.likes?.length || 0} likes
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Profile