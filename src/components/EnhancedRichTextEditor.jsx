"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Image as ImageIcon, Bold, Italic, Underline, List, Link, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextDisplay from "./RichTextDisplay";

export default function EnhancedRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  className = "",
  minHeight = "200px"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(true); // Default to preview mode
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

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
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.slice(0, start) + imageTag + value.slice(end);
        
        onChange(newValue);
        
        // Move cursor after the inserted image
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + imageTag.length, start + imageTag.length);
        }, 0);
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
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    const newText = before + selectedText + after;
    const newValue = value.slice(0, start) + newText + value.slice(end);
    
    onChange(newValue);
    
    // Update cursor position
    setTimeout(() => {
      textarea.focus();
      const newStart = start + before.length;
      const newEnd = newStart + selectedText.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const formatBold = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    
    if (selectedText) {
      // If text is selected, wrap it with **
      insertText('**', '**');
    } else {
      // If no text selected, insert ** and position cursor between them
      insertText('**', '**');
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  const formatItalic = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    
    if (selectedText) {
      // If text is selected, wrap it with *
      insertText('*', '*');
    } else {
      // If no text selected, insert * and position cursor between them
      insertText('*', '*');
      setTimeout(() => {
        textarea.setSelectionRange(start + 1, start + 1);
      }, 0);
    }
  };

  const formatUnderline = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    
    if (selectedText) {
      // If text is selected, wrap it with <u> tags
      insertText('<u>', '</u>');
    } else {
      // If no text selected, insert <u> and position cursor between them
      insertText('<u>', '</u>');
      setTimeout(() => {
        textarea.setSelectionRange(start + 3, start + 3);
      }, 0);
    }
  };

  const formatList = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    
    if (selectedText) {
      // If text is selected, add bullet point
      insertText('• ', '');
    } else {
      // If no text selected, insert bullet point
      insertText('• ', '');
    }
  };

  const formatLink = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    
    if (selectedText) {
      // If text is selected, make it a link
      const url = prompt('Enter URL:');
      if (url) {
        insertText(`[${selectedText}](`, `)`);
        setTimeout(() => {
          textarea.setSelectionRange(start + selectedText.length + 2, start + selectedText.length + 2);
        }, 0);
      }
    } else {
      // If no text selected, insert link template
      const url = prompt('Enter URL:');
      if (url) {
        insertText('[Link](', ')');
        setTimeout(() => {
          textarea.setSelectionRange(start + 1, start + 5);
        }, 0);
      }
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
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
    }
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
          onClick={formatLink}
          title="Add Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
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
          title={showPreview ? "Edit Markdown" : "Show Preview"}
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
        {showPreview ? (
          <div className="p-4 min-h-[200px] bg-white border-0">
            <RichTextDisplay content={value} showImages={true} />
          </div>
        ) : (
          <div className="relative">
            <div className="text-xs text-gray-500 p-2 bg-gray-50 border-b font-mono">
              Markdown Editor Mode - Click the eye icon to return to preview
            </div>
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-[200px] border-0 resize-none focus:ring-0"
              style={{ minHeight }}
            />
          </div>
        )}
        
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
