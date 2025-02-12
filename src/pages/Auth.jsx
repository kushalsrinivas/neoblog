import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const { signIn, signUp, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/profile', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { email, password } = formData
      if (isSignUp) {
        const { error } = await signUp({ email, password })
        if (error) throw error
        toast.success('Check your email to confirm your account!')
      } else {
        const { error } = await signIn({ email, password })
        if (error) throw error
        toast.success('Welcome back!')
        navigate('/profile')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
    } catch (error) {
      toast.error('Could not sign in with Google')
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="max-w-md mx-auto p-8 brutal-card">
      <h1 className="text-3xl font-black text-accent mb-8 text-center">
        {isSignUp ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="brutal-input w-full"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-bold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="brutal-input w-full"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="brutal-btn w-full bg-accent text-primary hover:bg-primary hover:text-accent"
          disabled={loading}
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleGoogleSignIn}
          className="brutal-btn w-full mb-4"
          disabled={loading}
        >
          Continue with Google
        </button>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm hover:underline"
        >
          {isSignUp
            ? 'Already have an account? Sign in'
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}

export default Auth
