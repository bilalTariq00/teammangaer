"use client"

import { useState, useEffect } from "react"
// import { SerializedEditorState } from "lexical"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ListItemNode, ListNode } from "@lexical/list"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { MarkNode } from "@lexical/mark"
// import { ImageNode } from "@lexical/file"

import { Editor } from "@/components/blocks/editor-00"

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenBoolean',
    builtin: 'editor-tokenBuiltin',
    cdata: 'editor-tokenCdata',
    char: 'editor-tokenChar',
    class: 'editor-tokenClass',
    'class-name': 'editor-tokenClassName',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenConstant',
    deleted: 'editor-tokenDeleted',
    doctype: 'editor-tokenDoctype',
    entity: 'editor-tokenEntity',
    function: 'editor-tokenFunction',
    important: 'editor-tokenImportant',
    inserted: 'editor-tokenInserted',
    keyword: 'editor-tokenKeyword',
    namespace: 'editor-tokenNamespace',
    number: 'editor-tokenNumber',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenProlog',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenRegex',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenString',
    symbol: 'editor-tokenSymbol',
    tag: 'editor-tokenTag',
    url: 'editor-tokenUrl',
    variable: 'editor-tokenVariable',
    'variable.constant': 'editor-tokenVariableConstant',
  },
}

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}

function onError(error) {
  console.error(error)
}

export default function ShadcnEditor({ 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  className = "",
  minHeight = "200px"
}) {
  const [editorState, setEditorState] = useState(value || initialValue)

  useEffect(() => {
    if (value && value !== editorState) {
      setEditorState(value)
    }
  }, [value])

  const handleSerializedChange = (newState) => {
    setEditorState(newState)
    if (onChange) {
      onChange(newState)
    }
  }

  const initialConfig = {
    namespace: 'ShadcnEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      MarkNode,
      // ImageNode,
    ],
    editorState: editorState,
  }

  return (
    <div className={className}>
      <LexicalComposer initialConfig={initialConfig}>
        <Editor
          editorSerializedState={editorState}
          onSerializedChange={handleSerializedChange}
          placeholder={placeholder}
          minHeight={minHeight}
        />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="w-full p-4 focus:outline-none resize-none"
              style={{ 
                minHeight,
                direction: 'ltr',
                textAlign: 'left'
              }}
              dir="ltr"
            />
          }
          placeholder={
            <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
      
      <style jsx global>{`
        .editor-placeholder {
          color: #999;
          overflow: hidden;
          position: absolute;
          text-overflow: ellipsis;
          top: 15px;
          left: 10px;
          right: 10px;
          user-select: none;
          white-space: nowrap;
          display: inline-block;
          pointer-events: none;
        }
        .editor-paragraph {
          margin: 0;
          margin-bottom: 8px;
          position: relative;
        }
        .editor-quote {
          margin: 0;
          margin-left: 20px;
          margin-bottom: 10px;
          padding-left: 16px;
          border-left: 4px solid #ccc;
        }
        .editor-heading-h1 {
          font-size: 24px;
          color: #5d5d5d;
          font-weight: 400;
          margin: 0;
          margin-bottom: 12px;
          padding: 0;
        }
        .editor-heading-h2 {
          font-size: 15px;
          color: #5d5d5d;
          font-weight: 700;
          margin: 0;
          margin-top: 10px;
          padding: 0;
          text-transform: uppercase;
        }
        .editor-heading-h3 {
          font-size: 12px;
          color: #5d5d5d;
          font-weight: 700;
          margin: 0;
          margin-top: 10px;
          padding: 0;
          text-transform: uppercase;
        }
        .editor-heading-h4 {
          font-size: 10px;
          color: #5d5d5d;
          font-weight: 700;
          margin: 0;
          margin-top: 10px;
          padding: 0;
          text-transform: uppercase;
        }
        .editor-heading-h5 {
          font-size: 8px;
          color: #5d5d5d;
          font-weight: 700;
          margin: 0;
          margin-top: 10px;
          padding: 0;
          text-transform: uppercase;
        }
        .editor-heading-h6 {
          font-size: 7px;
          color: #5d5d5d;
          font-weight: 700;
          margin: 0;
          margin-top: 10px;
          padding: 0;
          text-transform: uppercase;
        }
        .editor-list-ol {
          padding: 0;
          margin: 0;
          list-style-position: inside;
        }
        .editor-list-ul {
          padding: 0;
          margin: 0;
          list-style-position: inside;
        }
        .editor-listitem {
          margin: 8px 32px 8px 32px;
        }
        .editor-nested-listitem {
          list-style-type: none;
        }
        .editor-image {
          cursor: default;
          display: inline-block;
          position: relative;
          user-select: none;
        }
        .editor-image img {
          max-width: 100%;
          cursor: default;
        }
        .editor-link {
          color: #0066cc;
          text-decoration: none;
        }
        .editor-link:hover {
          text-decoration: underline;
        }
        .editor-text-bold {
          font-weight: bold;
        }
        .editor-text-italic {
          font-style: italic;
        }
        .editor-text-underline {
          text-decoration: underline;
        }
        .editor-text-strikethrough {
          text-decoration: line-through;
        }
        .editor-text-underlineStrikethrough {
          text-decoration: underline line-through;
        }
        .editor-text-code {
          background-color: rgb(240, 242, 245);
          padding: 1px 0.25rem;
          font-family: Menlo, Consolas, Monaco, monospace;
          font-size: 94%;
        }
        .editor-code {
          background-color: rgb(240, 242, 245);
          font-family: Menlo, Consolas, Monaco, monospace;
          display: block;
          padding: 8px 8px 8px 52px;
          line-height: 1.53;
          font-size: 13px;
          margin: 0;
          margin-top: 0;
          margin-bottom: 8px;
          tab-size: 2;
          overflow-x: auto;
          position: relative;
          counter-reset: line;
        }
        .editor-code:before {
          content: attr(data-gutter);
          left: 0;
          top: 0;
          position: absolute;
          background-color: #eee;
          padding-right: 8px;
          padding-left: 8px;
          counter-increment: line;
          content: counter(line);
          display: block;
          left: 0;
          top: 0;
          position: absolute;
          background-color: #eee;
          padding-right: 8px;
          padding-left: 8px;
          counter-increment: line;
          content: counter(line);
          display: block;
          left: 0;
          top: 0;
          position: absolute;
          background-color: #eee;
          padding-right: 8px;
          padding-left: 8px;
          counter-increment: line;
          content: counter(line);
          display: block;
        }
        .editor-tokenComment {
          color: slategray;
        }
        .editor-tokenPunctuation {
          color: #999;
        }
        .editor-tokenProperty {
          color: #905;
        }
        .editor-tokenSelector {
          color: #690;
        }
        .editor-tokenOperator {
          color: #9a6e3a;
        }
        .editor-tokenAttr {
          color: #07a;
        }
        .editor-tokenVariable {
          color: #e90;
        }
        .editor-tokenFunction {
          color: #dd4a68;
        }
      `}</style>
    </div>
  )
}
