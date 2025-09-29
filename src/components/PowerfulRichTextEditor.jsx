"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Strikethrough,
  Code as CodeIcon,
  List, 
  ListOrdered,
  Quote,
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  CheckSquare,
  Highlighter,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Undo,
  Redo,
  Eye,
  Edit3,
  Palette,
  Type
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useCallback } from "react"

export default function PowerfulRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  className = "",
  minHeight = "200px"
}) {
  const [showPreview, setShowPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      TextAlign,
      TextStyle,
      Color,
      Underline,
      Strike,
      Code,
      Placeholder.configure({
        placeholder,
      }),
      Table,
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem,
      Highlight,
      Superscript,
      Subscript,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  const addImage = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setIsUploading(true)
        // Convert file to base64 for demo purposes
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target.result
          editor?.chain().focus().setImage({ src: base64 }).run()
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }, [editor])

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  const MenuButton = ({ onClick, isActive = false, children, title, disabled = false }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-8 w-8 p-0",
        isActive && "bg-blue-100 text-blue-700"
      )}
    >
      {children}
    </Button>
  )

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <CodeIcon className="h-4 w-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Type className="h-4 w-4" />
            <span className="text-xs ml-1">H1</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Type className="h-4 w-4" />
            <span className="text-xs ml-1">H2</span>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Type className="h-4 w-4" />
            <span className="text-xs ml-1">H3</span>
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            title="Task List"
          >
            <CheckSquare className="h-4 w-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Special Formatting */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="Highlight"
          >
            <Highlighter className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive('superscript')}
            title="Superscript"
          >
            <SuperscriptIcon className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive('subscript')}
            title="Subscript"
          >
            <SubscriptIcon className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Media & Links */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={addLink}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={addImage}
            disabled={isUploading}
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={addTable}
            title="Add Table"
          >
            <TableIcon className="h-4 w-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* History */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Preview Toggle */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => setShowPreview(!showPreview)}
            isActive={showPreview}
            title={showPreview ? "Edit Mode" : "Preview Mode"}
          >
            {showPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </MenuButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative" style={{ minHeight }}>
        {showPreview ? (
          <div 
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        ) : (
          <EditorContent 
            editor={editor} 
            className="min-h-[200px]"
          />
        )}
      </div>
    </div>
  )
}
