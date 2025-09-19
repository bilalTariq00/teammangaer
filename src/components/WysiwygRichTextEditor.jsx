"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Image as ImageIcon, Bold, Italic, Underline, List, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextDisplay from "./RichTextDisplay";

export default function WysiwygRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  className = "",
  minHeight = "200px"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const [editPosition, setEditPosition] = useState({ start: 0, end: 0 });
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        const imageTag = `![${file.name}](${base64})`;
        
        // Insert image at cursor position
        const newValue = value + (value ? '\n\n' : '') + imageTag;
        onChange(newValue);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile);
    }
  };

  const insertText = (before, after = '') => {
    if (isEditing) {
      const newText = before + editingText + after;
      setEditingText(newText);
    } else {
      // Insert text at the end of content
      const newValue = value + before + after;
      onChange(newValue);
    }
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatBold();
          break;
        case 'i':
          e.preventDefault();
          formatItalic();
          break;
        case 'u':
          e.preventDefault();
          formatUnderline();
          break;
        default:
          break;
      }
    } else if (e.key.length === 1) {
      // Allow direct typing
      e.preventDefault();
      const newValue = value + e.key;
      onChange(newValue);
    }
  };

  const formatBold = () => {
    if (isEditing) {
      setEditingText(`**${editingText}**`);
    } else {
      insertText('**', '**');
    }
  };

  const formatItalic = () => {
    if (isEditing) {
      setEditingText(`*${editingText}*`);
    } else {
      insertText('*', '*');
    }
  };

  const formatUnderline = () => {
    if (isEditing) {
      setEditingText(`<u>${editingText}</u>`);
    } else {
      insertText('<u>', '</u>');
    }
  };

  const formatList = () => {
    if (isEditing) {
      setEditingText(`• ${editingText}`);
    } else {
      insertText('• ', '');
    }
  };

  const formatLink = () => {
    if (isEditing) {
      const url = prompt('Enter URL:');
      if (url) {
        setEditingText(`[${editingText}](${url})`);
      }
    } else {
      const url = prompt('Enter URL:');
      if (url) {
        insertText('[Link](', `)${url}`);
      }
    }
  };


  const handlePreviewClick = (e) => {
    if (e.target.tagName === 'STRONG' || e.target.tagName === 'EM' || e.target.tagName === 'U') {
      // Extract text from formatted element
      const text = e.target.textContent;
      setEditingText(text);
      setIsEditing(true);
      
      // Find the position in the original content
      const content = value;
      const index = content.indexOf(text);
      if (index !== -1) {
        setEditPosition({ start: index, end: index + text.length });
      }
    }
  };

  const handleEditSave = () => {
    if (isEditing) {
      // Replace the text in the original content
      const before = value.slice(0, editPosition.start);
      const after = value.slice(editPosition.end);
      const newValue = before + editingText + after;
      onChange(newValue);
      setIsEditing(false);
      setEditingText("");
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingText("");
  };

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatBold}
          title="Bold (Ctrl+B)"
          disabled={isEditing}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatItalic}
          title="Italic (Ctrl+I)"
          disabled={isEditing}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatUnderline}
          title="Underline (Ctrl+U)"
          disabled={isEditing}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatList}
          title="Bullet List"
          disabled={isEditing}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatLink}
          title="Add Link"
          disabled={isEditing}
        >
          <Link className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isEditing}
          title="Upload Image"
        >
          {isUploading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <ImageIcon className="h-4 w-4" />
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

      {/* Editor */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative"
      >
        <div className="p-4 bg-white border-0 relative" style={{ minHeight }}>
          {isEditing ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Editing text:</div>
              <Textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="min-h-[100px]"
                placeholder="Edit the selected text..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEditSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleEditCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div 
              ref={previewRef}
              onClick={handlePreviewClick}
              onKeyDown={handleKeyDown}
              className="cursor-text focus:outline-none"
              tabIndex={0}
              contentEditable={false}
            >
              <RichTextDisplay content={value} showImages={true} />
              {!value && (
                <div className="text-gray-400 italic">
                  {placeholder}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Drop overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-200 bg-blue-50 border-2 border-dashed border-blue-300 rounded-md flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <p className="text-blue-600 font-medium">Drop image here to upload</p>
          </div>
        </div>
      </div>
    </div>
  );
}
