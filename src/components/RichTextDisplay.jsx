"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RichTextDisplay({ 
  content, 
  className = "",
  showImages = true 
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleImageClick = (src, alt) => {
    setSelectedImage({ src, alt });
    setIsImageModalOpen(true);
  };

  const renderContent = () => {
    if (!content) return null;

    // First, let's handle images with a more comprehensive regex
    const imageRegex = /!\[([^\]]*)\]\((data:image\/[^;]+;base64,[^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    // Find all images and split content around them
    while ((match = imageRegex.exec(content)) !== null) {
      // Add text before image
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }
      
      // Add image
      parts.push({
        type: 'image',
        alt: match[1],
        src: match[2]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }
    
    return parts.map((part, index) => {
      if (part.type === 'image' && showImages) {
        return (
          <div key={index} className="my-4">
            <div className="relative group cursor-pointer" onClick={() => handleImageClick(part.src, part.alt)}>
              <img
                src={part.src}
                alt={part.alt}
                className="max-w-full h-auto rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
                onError={(e) => {
                  console.error('Image failed to load:', part.src.substring(0, 100) + '...');
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {part.alt && (
              <p className="text-sm text-gray-600 mt-2 text-center italic">{part.alt}</p>
            )}
          </div>
        );
      }
      
      // Regular text content with comprehensive markdown parsing
      if (part.type === 'text') {
        let processedText = part.content;
        
        // Handle bold text (**text**) first
        processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text (*text*) - but not if it's part of bold
        processedText = processedText.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
        
        // Handle underlined text (<u>text</u>)
        processedText = processedText.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
        
        // Handle links [text](url)
        processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
        
        // Handle bullet points
        processedText = processedText.replace(/^• /gm, '<span class="text-gray-600">• </span>');
        
        // Handle line breaks
        processedText = processedText.replace(/\n/g, '<br/>');
        
        return (
          <div
            key={index}
            className="text-sm leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        );
      }
      
      return null;
    });
  };

  return (
    <>
      <div className={cn("prose prose-sm max-w-none", className)}>
        {renderContent()}
      </div>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedImage?.alt || 'Image'}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsImageModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            {selectedImage && (
              <div className="flex justify-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
