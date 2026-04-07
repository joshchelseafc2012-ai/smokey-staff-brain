import { useState } from 'react'
import '../styles/LoginScreen.css'

// Demo credentials with role support
const DEMO_USERS = [
  {
    email: 'staff@smokey.com',
    password: 'staff123',
    name: 'Jay',
    role: 'staff',
    allowedBrains: ['staff']
  },
  {
    email: 'owner@smokey.com',
    password: 'owner123',
    name: 'Owner',
    role: 'owner',
    allowedBrains: ['staff', 'owner']
  },
  {
    email: 'client@smokey.com',
    password: 'client123',
    name: 'Client',
    role: 'client',
    allowedBrains: ['client']
  }
]

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate brief loading delay for UX
    setTimeout(() => {
      // Local credential check - no API call
      const user = DEMO_USERS.find(u => u.email === email && u.password === password)

      if (user) {
        // Store user data locally
        localStorage.setItem('staffName', user.name)
        localStorage.setItem('userRole', user.role)

        // Call parent onLogin handler with full user object (including role)
        onLogin({
          email: user.email,
          name: user.name,
          id: user.email,
          role: user.role,
          allowedBrains: user.allowedBrains
        })
      } else {
        setError('Invalid email or password')
      }

      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="logo-wrap">
          <img src="/assets/smokey-logo.png" alt="Smokey Barbers Logo" className="logo-placeholder" />
          <h1 className="brand-name">SMOKEY BRAINS</h1>
          <p className="brand-sub">AI Operating System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@barbershop.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? 'Entering...' : 'Enter the Brain'}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials</p>
          <ul>
            <li><strong>Staff:</strong> staff@smokey.com / staff123</li>
            <li><strong>Owner:</strong> owner@smokey.com / owner123</li>
            <li><strong>Client:</strong> client@smokey.com / client123</li>
          </ul>
        </div>

        <p className="footer-text">
          Powered by Josh AI Systems
        </p>
      </div>
    </div>
  )
}
