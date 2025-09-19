"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Eye,
  Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TiptapEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  className = "",
  minHeight = "200px"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        style: `min-height: ${minHeight}; direction: ltr; text-align: left;`,
        dir: 'ltr',
      },
    },
  });

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        if (editor) {
          editor.chain().focus().setImage({ src: base64, alt: file.name }).run();
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50', 'opacity-100');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'opacity-100');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50', 'opacity-100');

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      handleImageUpload(imageFile);
    }
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url && editor) {
      const text = prompt('Enter link text:') || url;
      editor.chain().focus().setLink({ href: url }).insertContent(text).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-gray-200' : ''}
          title="Strikethrough"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => document.getElementById('image-upload')?.click()}
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
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Editor */}
      {showPreview ? (
        <div
          className="w-full p-4 prose prose-sm max-w-none"
          style={{ 
            minHeight,
            direction: 'ltr',
            textAlign: 'left'
          }}
          dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
        />
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="p-4"
          style={{ minHeight }}
        >
          <EditorContent 
            editor={editor}
            className="focus:outline-none"
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
        </div>
      )}
      
      <style jsx>{`
        .ProseMirror {
          direction: ltr !important;
          text-align: left !important;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 20px;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        .ProseMirror a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
