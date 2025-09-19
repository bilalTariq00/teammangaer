"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List, 
  ListOrdered,
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Eye,
  Edit3
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SimpleShadcnEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  className = "",
  minHeight = "200px"
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [textValue, setTextValue] = useState("")
  const editorRef = useRef(null)
  const fileInputRef = useRef(null)

  // Convert HTML to plain text for editing
  const htmlToText = (html) => {
    if (!html) return ""
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ""
  }

  // Convert plain text back to HTML with basic formatting
  const textToHtml = (text) => {
    if (!text) return ""
    
    let html = text
    
    // Handle bold text (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Handle italic text (*text*)
    html = html.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>')
    
    // Handle underlined text (<u>text</u>)
    html = html.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
    
    // Handle strikethrough text (~~text~~)
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
    
    // Handle links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
    
    // Handle bullet points
    html = html.replace(/^• /gm, '<span class="text-gray-600">• </span>')
    
    // Handle numbered lists
    html = html.replace(/^\d+\. /gm, '<span class="text-gray-600">$&</span>')
    
    // Handle line breaks
    html = html.replace(/\n/g, '<br/>')
    
    return html
  }

  // Initialize text value from HTML
  useEffect(() => {
    setTextValue(htmlToText(value))
  }, [value])

  const handleTextChange = (e) => {
    const newText = e.target.value
    setTextValue(newText)
    const html = textToHtml(newText)
    onChange(html)
  }

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result
        const imageMarkdown = `![${file.name}](${base64})`
        
        // Insert image at cursor position
        const textarea = editorRef.current
        if (textarea) {
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const newText = textValue.substring(0, start) + imageMarkdown + textValue.substring(end)
          
          setTextValue(newText)
          const html = textToHtml(newText)
          onChange(html)
          
          // Set cursor position after the image
          setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length)
          }, 0)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [textValue, onChange])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50', 'opacity-100')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'opacity-100')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'opacity-100')

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))

    if (imageFile) {
      handleImageUpload(imageFile)
    }
  }

  const insertFormatting = (before, after = '') => {
    const textarea = editorRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textValue.substring(start, end)
    const newText = textValue.substring(0, start) + before + selectedText + after + textValue.substring(end)
    
    setTextValue(newText)
    const html = textToHtml(newText)
    onChange(html)
    
    // Set cursor position after the formatting
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const formatBold = () => {
    insertFormatting('**', '**')
  }

  const formatItalic = () => {
    insertFormatting('*', '*')
  }

  const formatUnderline = () => {
    insertFormatting('<u>', '</u>')
  }

  const formatStrikethrough = () => {
    insertFormatting('~~', '~~')
  }

  const formatLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      const text = prompt('Enter link text:') || url
      insertFormatting(`[${text}](`, ')')
    }
  }

  const formatList = () => {
    const textarea = editorRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textValue.substring(start, end)
    
    if (selectedText) {
      // Convert selected text to bullet points
      const lines = selectedText.split('\n')
      const bulletLines = lines.map(line => line.trim() ? `• ${line.trim()}` : line)
      const newText = textValue.substring(0, start) + bulletLines.join('\n') + textValue.substring(end)
      
      setTextValue(newText)
      const html = textToHtml(newText)
      onChange(html)
    } else {
      insertFormatting('• ')
    }
  }

  const formatNumberedList = () => {
    const textarea = editorRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textValue.substring(start, end)
    
    if (selectedText) {
      // Convert selected text to numbered list
      const lines = selectedText.split('\n')
      const numberedLines = lines.map((line, index) => line.trim() ? `${index + 1}. ${line.trim()}` : line)
      const newText = textValue.substring(0, start) + numberedLines.join('\n') + textValue.substring(end)
      
      setTextValue(newText)
      const html = textToHtml(newText)
      onChange(html)
    } else {
      insertFormatting('1. ')
    }
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          formatBold()
          break
        case 'i':
          e.preventDefault()
          formatItalic()
          break
        case 'u':
          e.preventDefault()
          formatUnderline()
          break
        default:
          break
      }
    }
  }

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatBold}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatItalic}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatUnderline}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatStrikethrough}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatList}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatNumberedList}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatLink}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Upload Image"
        >
          {isUploading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          title={showPreview ? "Edit Mode" : "Preview Mode"}
        >
          {showPreview ? (
            <Edit3 className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Editor - Using regular textarea or preview */}
      {showPreview ? (
        <div
          className="w-full p-4 prose prose-sm max-w-none"
          style={{ 
            minHeight,
            direction: 'ltr',
            textAlign: 'left'
          }}
          dangerouslySetInnerHTML={{ __html: textToHtml(textValue) }}
        />
      ) : (
        <textarea
          ref={editorRef}
          value={textValue}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="w-full p-4 focus:outline-none resize-none"
          style={{ 
            minHeight,
            direction: 'ltr',
            textAlign: 'left',
            fontFamily: 'inherit',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
          placeholder={placeholder}
          dir="ltr"
        />
      )}
      
      <style jsx>{`
        textarea {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: normal !important;
          writing-mode: horizontal-tb !important;
        }
        textarea::placeholder {
          direction: ltr !important;
          text-align: left !important;
        }
        .prose {
          direction: ltr !important;
          text-align: left !important;
        }
        .prose * {
          direction: ltr !important;
          text-align: left !important;
        }
      `}</style>
    </div>
  )
}
