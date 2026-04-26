import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: '#ffffff',
      borderBottom: '1px solid #eeeeee',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
    }}>
      <Link to="/" style={{
        fontSize: '22px',
        fontWeight: '700',
        color: '#D85A30',
        letterSpacing: '-0.5px'
      }}>
        🍳 FlavorReel
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            <Link to="/upload" style={{
              background: '#D85A30',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none'
            }}>
              + Upload
            </Link>
            <Link to={`/profile/${user._id}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f5f5f5',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#1a1a1a'
            }}>
              👤 {user.username}
            </Link>
            <button onClick={handleLogout} style={{
              background: 'transparent',
              border: '1px solid #ddd',
              color: '#888',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              background: 'transparent',
              border: '1px solid #ddd',
              color: '#1a1a1a',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              Login
            </Link>
            <Link to="/register" style={{
              background: '#D85A30',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar