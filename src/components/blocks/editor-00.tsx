"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import { useCallback, useEffect, useRef, useState } from "react"
import { SerializedEditorState } from "lexical"

import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Image as ImageIcon,
} from "lucide-react"

interface EditorProps {
  editorSerializedState?: SerializedEditorState
  onSerializedChange?: (value: SerializedEditorState) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function Editor({
  editorSerializedState,
  onSerializedChange,
  placeholder = "Enter content...",
  className = "",
  minHeight = "200px",
}: EditorProps) {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isList, setIsList] = useState(false)
  const [isOrderedList, setIsOrderedList] = useState(false)
  const [isQuote, setIsQuote] = useState(false)
  const [alignment, setAlignment] = useState<string>("left")

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
      setIsStrikethrough(selection.hasFormat("strikethrough"))
      setIsCode(selection.hasFormat("code"))
      setIsLink(selection.hasFormat("link"))
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
        if (onSerializedChange) {
          onSerializedChange(editorState.toJSON())
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar()
          return false
        },
        1,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        1,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        1,
      ),
    )
  }, [editor, updateToolbar, onSerializedChange])

  const formatText = (format: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }

  const formatElement = (format: string) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format)
  }

  const insertLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "link")
    }
  }

  const insertImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              const img = document.createElement("img")
              img.src = base64
              img.alt = file.name
              img.style.maxWidth = "100%"
              img.style.height = "auto"
              selection.insertNodes([{ type: "img", src: base64, alt: file.name }])
            }
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div className={`border rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("bold")}
          className={isBold ? "bg-gray-200" : ""}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("italic")}
          className={isItalic ? "bg-gray-200" : ""}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("underline")}
          className={isUnderline ? "bg-gray-200" : ""}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("strikethrough")}
          className={isStrikethrough ? "bg-gray-200" : ""}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("code")}
          className={isCode ? "bg-gray-200" : ""}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className={isLink ? "bg-gray-200" : ""}
          title="Add Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertImage}
          title="Upload Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatElement("bullet")}
          className={isList ? "bg-gray-200" : ""}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatElement("number")}
          className={isOrderedList ? "bg-gray-200" : ""}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatElement("quote")}
          className={isQuote ? "bg-gray-200" : ""}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatElement("left")}
          className={alignment === "left" ? "bg-gray-200" : ""}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatElement("center")}
          className={alignment === "center" ? "bg-gray-200" : ""}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatElement("right")}
          className={alignment === "right" ? "bg-gray-200" : ""}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatElement("justify")}
          className={alignment === "justify" ? "bg-gray-200" : ""}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div
        className="w-full p-4 focus:outline-none"
        style={{ 
          minHeight,
          direction: 'ltr',
          textAlign: 'left'
        }}
        contentEditable
        suppressContentEditableWarning
        dir="ltr"
      />
    </div>
  )
}
