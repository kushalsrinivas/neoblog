import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Post from './pages/Post'
import WriteBlog from './pages/WriteBlog'
import EditBlog from './pages/EditBlog'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="post/:id" element={<Post />} />
        <Route element={<PrivateRoute />}>
          <Route path="write" element={<WriteBlog />} />
          <Route path="edit/:id" element={<EditBlog />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
