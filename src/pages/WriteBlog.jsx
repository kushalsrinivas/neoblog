import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

function WriteBlog() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [blogId, setBlogId] = useState(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
  })

  // Auto-save functionality
  useEffect(() => {
    if (!editor || !title) return

    const saveTimeout = setTimeout(async () => {
      await saveDraft()
    }, 3000)

    return () => clearTimeout(saveTimeout)
  }, [editor?.getHTML(), title])

  const saveDraft = async () => {
    try {
      setSaving(true)
      const content = editor.getHTML()
      
      if (!content.trim() || !title.trim()) return

      const slug = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      const blogData = {
        title,
        content,
        author_id: user.id,
        slug,
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      }

      if (blogId) {
        blogData.id = blogId
      }

      const { data, error } = await supabase
        .from('blogs')
        .upsert(blogData)
        .select()
        .single()

      if (error) throw error

      if (!blogId) {
        setBlogId(data.id)
        toast.success('Draft saved')
      }
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const publishBlog = async () => {
    try {
      if (!title.trim() || !editor?.getHTML().trim()) {
        toast.error('Title and content are required')
        return
      }

      const { error } = await supabase
        .from('blogs')
        .update({ 
          published_at: new Date().toISOString() 
        })
        .eq('id', blogId)

      if (error) throw error

      toast.success('Blog published successfully!')
      navigate(`/post/${blogId}`)
    } catch (error) {
      console.error('Error publishing blog:', error)
      toast.error('Failed to publish blog')
    }
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
            onClick={saveDraft}
            className="px-4 py-2 border border-black rounded hover:bg-gray-100"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={publishBlog}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Publish
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

export default WriteBlog
