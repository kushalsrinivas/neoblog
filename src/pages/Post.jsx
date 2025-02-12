import { useParams } from 'react-router-dom'
import { posts } from '../data/posts'

function Post() {
  const { id } = useParams()
  const post = posts.find(p => p.id === parseInt(id))

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <article className="prose lg:prose-xl mx-auto">
      <img 
        src={post.image} 
        alt={post.title}
        className="w-full h-64 object-cover rounded-lg mb-8"
      />
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">{post.title}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <span>{post.date}</span>
        <span className="mx-2">•</span>
        <span>{post.readTime} min read</span>
      </div>
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
    </article>
  )
}

export default Post
