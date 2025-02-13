import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createPlateUI, Plate, createPlugins, PlateContent, PlateFloatingToolbar } from '@udecode/plate-common'
import { createParagraphPlugin } from '@udecode/plate-paragraph'
import { createHeadingPlugin } from '@udecode/plate-heading'
import { createBlockquotePlugin } from '@udecode/plate-block-quote'
import { createBasicElementsPlugin } from '@udecode/plate-basic-elements'
import { createBasicMarksPlugin } from '@udecode/plate-basic-marks'
import { createLinkPlugin } from '@udecode/plate-link'
import { createListPlugin } from '@udecode/plate-list'
import { createAlignPlugin } from '@udecode/plate-alignment'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const plugins = createPlugins([
  createParagraphPlugin(),
  createBlockquotePlugin(),
  createHeadingPlugin(),
  createBasicElementsPlugin(),
  createBasicMarksPlugin(),
  createLinkPlugin(),
  createListPlugin(),
  createAlignPlugin(),
], {
  components: createPlateUI(),
})

const Toolbar = () => {
  return (
    <div className="border-b border-gray-200 p-4 space-x-4">
      <button
        onClick={() => {
          // Add toolbar functionality
        }}
        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
      >
        Bold
      </button>
      {/* Add more toolbar buttons */}
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
  const [content, setContent] = useState([
    {
      type: 'p',
      children: [{ text: '' }],
    },
  ])

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
        setContent(JSON.parse(data.content))
      } catch (error) {
        console.error('Error fetching blog:', error)
        toast.error('Failed to load blog')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id, user.id, navigate])

  const updateBlog = async () => {
    try {
      setSaving(true)

      if (!title.trim() || !content) {
        toast.error('Title and content are required')
        return
      }

      const { error } = await supabase
        .from('blogs')
        .update({
          title,
          content: JSON.stringify(content),
          excerpt: content[0]?.children?.[0]?.text?.substring(0, 150) + '...' || '',
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
        <Toolbar />
        <Plate
          plugins={plugins}
          initialValue={content}
          onChange={setContent}
        >
          <PlateFloatingToolbar />
          <PlateContent 
            className="min-h-[500px] border rounded p-4 focus:outline-none"
            placeholder="Start writing your blog..."
          />
        </Plate>
      </div>
    </div>
  )
}

export default EditBlog
