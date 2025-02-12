import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [activeTab, setActiveTab] = useState('blogs')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchUserBlogs()
    fetchBookmarks()
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      toast.error('Error fetching profile')
      console.error('Error:', error)
    }
  }

  const fetchUserBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBlogs(data)
    } catch (error) {
      toast.error('Error fetching blogs')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          blog_id,
          blogs (
            id,
            title,
            excerpt,
            created_at,
            author_id,
            profiles:author_id (
              name
            )
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error
      setBookmarks(data.map(b => b.blogs))
    } catch (error) {
      toast.error('Error fetching bookmarks')
      console.error('Error:', error)
    }
  }

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error
      toast.success('Profile updated successfully')
      fetchProfile()
    } catch (error) {
      toast.error('Error updating profile')
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="brutal-container py-8">
      {/* Profile Header */}
      <div className="brutal-card mb-8">
        <div className="flex items-center gap-6">
          <img
            src={profile?.avatar_url || 'https://via.placeholder.com/100'}
            alt={profile?.name}
            className="w-24 h-24 rounded-full border-2 border-accent"
          />
          <div>
            <h1 className="text-3xl font-black mb-2">{profile?.name}</h1>
            <p className="text-lg mb-4">{profile?.bio || 'No bio yet'}</p>
            <button
              onClick={() => {/* Add edit profile modal/form */}}
              className="brutal-btn"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`brutal-btn ${activeTab === 'blogs' ? 'bg-accent text-primary' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          My Blogs
        </button>
        <button
          className={`brutal-btn ${activeTab === 'bookmarks' ? 'bg-accent text-primary' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          Bookmarks
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'blogs' ? (
          blogs.length > 0 ? (
            blogs.map(blog => (
              <Link key={blog.id} to={`/post/${blog.id}`} className="brutal-card">
                <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
                <p className="text-sm mb-4">{blog.excerpt}</p>
                <div className="text-sm text-gray-600">
                  {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))
          ) : (
            <p>No blogs yet. <Link to="/write" className="brutal-link">Write your first blog!</Link></p>
          )
        ) : (
          bookmarks.length > 0 ? (
            bookmarks.map(blog => (
              <Link key={blog.id} to={`/post/${blog.id}`} className="brutal-card">
                <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
                <p className="text-sm mb-4">{blog.excerpt}</p>
                <div className="text-sm text-gray-600">
                  By {blog.profiles.name} • {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))
          ) : (
            <p>No bookmarks yet.</p>
          )
        )}
      </div>
    </div>
  )
}

export default Profile
