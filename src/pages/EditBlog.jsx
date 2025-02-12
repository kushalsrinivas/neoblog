import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

function EditBlog() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialContent, setInitialContent] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your blog post here...',
      }),
      Image,
    ],
    content: initialContent,
  })

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        if (data.author_id !== user.id) {
          toast.error('You are not authorized to edit this blog')
          navigate('/profile')
          return
        }

        setTitle(data.title)
        setInitialContent(data.content)
        editor?.commands.setContent(data.content)
      } catch (error) {
        console.error(error)
        toast.error('Error fetching blog')
      }
    }

    if (id) {
      fetchBlog()
    }
  }, [id, user.id, navigate, editor])

  const updateBlog = async () => {
    if (!title) {
      toast.error('Please add a title')
      return
    }

    setLoading(true)
    try {
      const content = editor.getHTML()
      const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      
      const { error } = await supabase
        .from('blogs')
        .update({
          title,
          slug,
          content,
          excerpt: content.substring(0, 200).replace(/<[^>]*>/g, ''),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Blog updated successfully!')
      navigate('/profile')
    } catch (error) {
      toast.error('Error updating blog')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteBlog = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Blog deleted successfully!')
      navigate('/profile')
    } catch (error) {
      toast.error('Error deleting blog')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!editor) return null

  return (
    <div className="max-w-4xl mx-auto p-6">
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-4xl font-bold mb-8 p-2 border-b-2 border-gray-200 focus:outline-none focus:border-black"
      />
      
      <EditorContent 
        editor={editor} 
        className="prose max-w-none min-h-[400px]"
      />

      <div className="flex justify-between mt-8">
        <button
          onClick={deleteBlog}
          disabled={loading}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Blog
        </button>
        <button
          onClick={updateBlog}
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Update Blog
        </button>
      </div>
    </div>
  )
}

export default EditBlog
