import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createPlugins,
  Plate,
  PlateContent,
  createPlateUI,
  getPluginType,
  usePlateEditorRef,
} from '@udecode/plate-common'
import {
  createParagraphPlugin,
  ELEMENT_PARAGRAPH,
} from '@udecode/plate-paragraph'
import { createHeadingPlugin } from '@udecode/plate-heading'
import {
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
} from '@udecode/plate-basic-marks'
import { createBlockquotePlugin } from '@udecode/plate-block-quote'
import { createListPlugin } from '@udecode/plate-list'
import { ToolbarButton, HeadingToolbar } from '@udecode/plate-toolbar'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// Define element types
const HEADING_1 = 'h1'
const HEADING_2 = 'h2'
const HEADING_3 = 'h3'

const plugins = createPlugins([
  createParagraphPlugin(),
  createHeadingPlugin(),
  createBlockquotePlugin(),
  createBoldPlugin(),
  createItalicPlugin(),
  createUnderlinePlugin(),
  createListPlugin(),
], {
  components: createPlateUI(),
})

const CustomToolbarButton = ({ format, icon, ...props }) => {
  const editor = usePlateEditorRef()

  const isActive = () => {
    const pluginType = getPluginType(editor, format)
    return editor?.marks ? editor.marks[pluginType] === true : false
  }

  return (
    <ToolbarButton
      active={isActive()}
      onMouseDown={(e) => {
        e.preventDefault()
        editor.toggleMark(format)
      }}
      {...props}
    >
      {icon}
    </ToolbarButton>
  )
}

const Toolbar = () => {
  return (
    <HeadingToolbar className="border-b border-gray-200 p-2 mb-4 flex gap-2">
      <CustomToolbarButton format={MARK_BOLD} icon="B" />
      <CustomToolbarButton format={MARK_ITALIC} icon="I" />
      <CustomToolbarButton format={MARK_UNDERLINE} icon="U" />
      <span className="border-l border-gray-200 mx-2" />
      <CustomToolbarButton format={HEADING_1} icon="H1" />
      <CustomToolbarButton format={HEADING_2} icon="H2" />
      <CustomToolbarButton format={HEADING_3} icon="H3" />
    </HeadingToolbar>
  )
}

function WriteBlog() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [blogId, setBlogId] = useState(null)
  const [content, setContent] = useState([
    {
      type: ELEMENT_PARAGRAPH,
      children: [{ text: '' }],
    },
  ])

  // Auto-save functionality
  useEffect(() => {
    if (!content || !title) return

    const saveTimeout = setTimeout(async () => {
      await saveDraft()
    }, 3000)

    return () => clearTimeout(saveTimeout)
  }, [content, title])

  const saveDraft = async () => {
    try {
      setSaving(true)
      
      if (!content || !title.trim()) return

      const slug = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      const blogData = {
        title,
        content: JSON.stringify(content),
        author_id: user.id,
        slug,
        excerpt: content[0]?.children?.[0]?.text?.substring(0, 150) + '...' || '',
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
      if (!title.trim() || !content) {
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
        <Plate
          plugins={plugins}
          initialValue={content}
          onChange={setContent}
        >
          <Toolbar />
          <PlateContent 
            className="min-h-[500px] border rounded p-4 focus:outline-none"
            placeholder="Start writing your blog..."
          />
        </Plate>
      </div>
    </div>
  )
}
