import { useState, useEffect } from 'react'
import BlogCard from '../components/BlogCard'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            name,
            avatar_url
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data)
    } catch (error) {
      toast.error('Error loading posts')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-black text-accent">Latest Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center text-lg">No posts yet!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
