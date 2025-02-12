import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

function Profile() {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBlogs(data)
      } catch (error) {
        console.error(error)
        toast.error('Error fetching blogs')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [user.id])

  if (loading) {
    return <div>Loading...</div>
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
              <Link
                to={`/edit/${blog.id}`}
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Edit
              </Link>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{blog.published_at ? 'Published' : 'Draft'}</span>
            </div>
          </div>
        ))}

        {blogs.length === 0 && (
          <div className="text-center text-gray-500">
            You haven't written any blogs yet. Start writing!
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
