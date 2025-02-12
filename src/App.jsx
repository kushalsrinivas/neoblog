import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Post from './pages/Post'
import Auth from './pages/Auth'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post/:id" element={<Post />} />
          <Route path="auth" element={<Auth />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </AuthProvider>
  )
}

export default App
