import { Link } from 'react-router-dom'

function BlogCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link to={`/post/${post.id}`}>
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default BlogCard
