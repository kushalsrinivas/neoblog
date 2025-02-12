import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const MenuBar = ({ editor }) => {
  if (!editor) return null

  return (
    <div className="border-b border-gray-200 p-4 space-x-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-gray-100'}`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-gray-100'}`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading') ? 'bg-black text-white' : 'bg-gray-100'}`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-black text-white' : 'bg-gray-100'}`}
      >
        Bullet List
      </button>
    </div>
  )
}

function EditBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
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
          toast.error('You do not have permission to edit this blog')
          navigate('/')
          return
        }

        setTitle(data.title)
        editor?.commands.setContent(data.content)
      } catch (error) {
        console.error('Error fetching blog:', error)
        toast.error('Failed to load blog')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    if (editor) {
      fetchBlog()
    }
  }, [id, editor, user.id, navigate])

  const updateBlog = async () => {
    try {
      setSaving(true)

      if (!title.trim() || !editor?.getHTML().trim()) {
        toast.error('Title and content are required')
        return
      }

      const { error } = await supabase
        .from('blogs')
        .update({
          title,
          content: editor.getHTML(),
          excerpt: editor.getHTML().replace(/<[^>]*>/g, '').substring(0, 150) + '...',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Blog updated successfully!')
      navigate(`/post/${id}`)
    } catch (error) {
      console.error('Error updating blog:', error)
      toast.error('Failed to update blog')
    } finally {
      setSaving(false)
    }
  }

  const deleteBlog = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Blog deleted successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-4xl font-bold w-full focus:outline-none"
        />
        <div className="flex space-x-4">
          <button
            onClick={deleteBlog}
            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
          >
            Delete
          </button>
          <button
            onClick={updateBlog}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="min-h-[500px] border rounded p-4" />
      </div>
    </div>
  )
}

export default EditBlog
