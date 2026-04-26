import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError('Please fill in all fields!')
      return
    }
    try {
      const res = await axios.post('https://flavorreel-backend.onrender.com/api/auth/register', {
        username,
        email,
        password
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid #eeeeee',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '6px',
          color: '#1a1a1a'
        }}>
          Join FlavorReel 🍳
        </h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>
          Share your cooking with the world
        </p>

        {error && (
          <div style={{
            background: '#fff0f0',
            color: '#e53e3e',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px',
            border: '1px solid #fed7d7'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
            Username
          </label>
          <input
            type="text"
            placeholder="e.g. chefpriya"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: '#f9f9f9',
              border: '1px solid #eeeeee',
              borderRadius: '8px',
              color: '#1a1a1a',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: '#f9f9f9',
              border: '1px solid #eeeeee',
              borderRadius: '8px',
              color: '#1a1a1a',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: '#f9f9f9',
              border: '1px solid #eeeeee',
              borderRadius: '8px',
              color: '#1a1a1a',
              fontSize: '14px'
            }}
          />
        </div>

        <button
          onClick={handleRegister}
          style={{
            width: '100%',
            padding: '12px',
            background: '#D85A30',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600'
          }}
        >
          Create account
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#888' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#D85A30', fontWeight: '500' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register