import { useState } from 'react'
import '../styles/LoginScreen.css'

// Demo credentials - local check only, no API call
const DEMO_USERS = [
  { email: 'demo@smokey.com', password: 'demo123', name: 'Demo Staff' },
  { email: 'manager@smokey.com', password: 'manager123', name: 'Manager' },
  { email: 'barber@smokey.com', password: 'barber123', name: 'Barber' },
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
        // Store staff name locally
        localStorage.setItem('staffName', user.name)

        // Call parent onLogin handler
        onLogin({
          email: user.email,
          name: user.name,
          id: user.email
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
          <h1 className="brand-name">SMOKEY STAFF BRAIN</h1>
          <p className="brand-sub">Internal Access Only</p>
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

        <p className="footer-text">
          Powered by Josh AI Systems
        </p>
      </div>
    </div>
  )
}
