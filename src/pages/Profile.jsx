// Add loading states and error boundaries
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

function Profile() {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBlogs(data)
      } catch (error) {
        console.error('Error fetching blogs:', error)
        setError('Failed to load blogs. Please try again.')
        toast.error('Error loading blogs')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [user.id])

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Blogs</h1>
        <Link
          to="/write"
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Write New Blog
        </Link>
      </div>

      <div className="space-y-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="border border-gray-200 p-6 rounded-lg hover:border-black transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
              </div>
              <div className="space-x-2">
                <Link
                  to={`/edit/${blog.id}`}
                  className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Edit
                </Link>
                {blog.published_at && (
                  <Link
                    to={`/post/${blog.slug}`}
                    className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span className={blog.published_at ? 'text-green-600' : 'text-yellow-600'}>
                {blog.published_at ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        ))}

        {blogs.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600 mb-4">No blogs yet</h3>
            <Link
              to="/write"
              className="text-black underline hover:text-gray-600"
            >
              Start writing your first blog
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
