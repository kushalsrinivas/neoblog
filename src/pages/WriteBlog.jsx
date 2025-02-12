import { useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const MenuBar = ({ editor }) => {
  if (!editor) return null

  return (
    <div className="border-b border-gray-200 p-4 space-x-4 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-gray-200'}`}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-gray-200'}`}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1 rounded ${editor.isActive('heading') ? 'bg-black text-white' : 'bg-gray-200'}`}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-black text-white' : 'bg-gray-200'}`}
      >
        bullet list
      </button>
    </div>
  )
}

function WriteBlog() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [blogId, setBlogId] = useState(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your blog post here...',
      }),
      Image,
    ],
    content: '',
  })

  const saveDraft = useCallback(async () => {
    if (!title) {
      toast.error('Please add a title')
      return
    }

    setLoading(true)
    try {
      const content = editor.getHTML()
      const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      
      const blogData = {
        title,
        slug,
        content,
        author_id: user.id,
        excerpt: content.substring(0, 200).replace(/<[^>]*>/g, ''),
      }

      if (blogId) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', blogId)

        if (error) throw error
        toast.success('Draft updated successfully!')
      } else {
        const { data, error } = await supabase
          .from('blogs')
          .insert([blogData])
          .select()

        if (error) throw error
        setBlogId(data[0].id)
        toast.success('Draft saved successfully!')
      }
    } catch (error) {
      toast.error('Error saving draft')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [title, editor, user.id, blogId])

  const publishBlog = useCallback(async () => {
    if (!title) {
      toast.error('Please add a title')
      return
    }

    setLoading(true)
    try {
      const content = editor.getHTML()
      const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      
      const blogData = {
        title,
        slug,
        content,
        author_id: user.id,
        excerpt: content.substring(0, 200).replace(/<[^>]*>/g, ''),
        published_at: new Date().toISOString(),
      }

      if (blogId) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', blogId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData])

        if (error) throw error
      }

      toast.success('Blog published successfully!')
      navigate('/profile')
    } catch (error) {
      toast.error('Error publishing blog')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [title, editor, user.id, blogId, navigate])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-4xl font-bold mb-8 p-2 border-b-2 border-gray-200 focus:outline-none focus:border-black"
      />
      
      <MenuBar editor={editor} />
      
      <EditorContent 
        editor={editor} 
        className="prose max-w-none min-h-[400px]"
      />

      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={saveDraft}
          disabled={loading}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Save Draft
        </button>
        <button
          onClick={publishBlog}
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Publish
        </button>
      </div>
    </div>
  )
}

export default WriteBlog
