import { Link } from 'react-router-dom'

function BlogCard({ post }) {
  return (
    <Link to={`/post/${post.id}`} className="brutal-card group">
      {post.cover_image && (
        <img 
          src={post.cover_image} 
          alt={post.title}
          className="w-full h-48 object-cover mb-4 border-2 border-accent"
        />
      )}
      <h2 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
        {post.title}
      </h2>
      <p className="text-gray-600 mb-4">{post.excerpt}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <img
            src={post.profiles.avatar_url || 'https://via.placeholder.com/32'}
            alt={post.profiles.name}
            className="w-8 h-8 rounded-full border border-accent"
          />
          <span>{post.profiles.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>👁️ {post.view_count || 0}</span>
          <span>❤️ {post.likes_count || 0}</span>
        </div>
      </div>
    </Link>
  )
}
