import BlogCard from '../components/BlogCard'
import { posts } from '../data/posts'

function Home() {
  return (
    <div>
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">Latest Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Home
