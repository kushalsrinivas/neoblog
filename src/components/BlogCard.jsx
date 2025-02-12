import { Link } from 'react-router-dom'

function BlogCard({ post }) {
  return (
    <article className="brutal-card">
      <Link to={`/post/${post.id}`}>
        <div className="overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black text-accent mb-3 uppercase">
            {post.title}
          </h2>
          <p className="text-text mb-4 text-lg">
            {post.excerpt}
          </p>
          <div className="flex items-center text-sm font-bold text-accent">
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
