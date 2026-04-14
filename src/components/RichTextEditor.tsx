import React, { useState, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Plus,
  Upload,
  X,
  Columns,
  Rows,
  Trash2,
  MoveHorizontal,
  MoveVertical,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

/* ------------------------------------------------------------------ */
/*  Table Insert Dialog                                                */
/* ------------------------------------------------------------------ */
interface TableDialogProps {
  onInsert: (rows: number, cols: number) => void;
  onClose: () => void;
}

const TableInsertDialog: React.FC<TableDialogProps> = ({ onInsert, onClose }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hoveredRow, setHoveredRow] = useState(0);
  const [hoveredCol, setHoveredCol] = useState(0);

  const maxGridRows = 8;
  const maxGridCols = 8;

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-xl z-50 p-4 min-w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800">Insert Table</h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Visual Grid Picker */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2">Click to select size or use inputs below</p>
        <div className="inline-grid gap-[2px] p-1 bg-gray-100 rounded">
          {Array.from({ length: maxGridRows }).map((_, rIdx) => (
            <div key={rIdx} className="flex gap-[2px]">
              {Array.from({ length: maxGridCols }).map((_, cIdx) => (
                <div
                  key={cIdx}
                  className={`w-5 h-5 border rounded-sm cursor-pointer transition-colors ${
                    rIdx < hoveredRow && cIdx < hoveredCol
                      ? 'bg-blue-500 border-blue-600'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
                  onMouseEnter={() => {
                    setHoveredRow(rIdx + 1);
                    setHoveredCol(cIdx + 1);
                  }}
                  onClick={() => {
                    onInsert(rIdx + 1, cIdx + 1);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        {hoveredRow > 0 && hoveredCol > 0 && (
          <p className="text-xs text-blue-600 mt-1 font-medium">
            {hoveredRow} × {hoveredCol} table
          </p>
        )}
      </div>

      {/* Manual Input */}
      <div className="border-t pt-3">
        <p className="text-xs text-gray-500 mb-2">Or enter custom size:</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Rows className="w-3 h-3 text-gray-500" />
            <input
              type="number"
              min={1}
              max={20}
              value={rows}
              onChange={(e) => setRows(Math.max(1, Math.min(20, Number(e.target.value))))}
              className="w-14 h-8 text-sm border rounded px-2 text-center"
              placeholder="Rows"
            />
          </div>
          <span className="text-gray-400">×</span>
          <div className="flex items-center gap-1">
            <Columns className="w-3 h-3 text-gray-500" />
            <input
              type="number"
              min={1}
              max={20}
              value={cols}
              onChange={(e) => setCols(Math.max(1, Math.min(20, Number(e.target.value))))}
              className="w-14 h-8 text-sm border rounded px-2 text-center"
              placeholder="Cols"
            />
          </div>
          <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onInsert(rows, cols)}>
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Image Upload Dialog                                                */
/* ------------------------------------------------------------------ */
interface ImageDialogProps {
  onInsert: (url: string) => void;
  onClose: () => void;
}

const ImageUploadDialog: React.FC<ImageDialogProps> = ({ onInsert, onClose }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) onInsert(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFileSelect(files[0]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFileSelect(files[0]);
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-xl z-50 p-4 min-w-[320px]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800">Insert Image</h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-3 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 font-medium">Drop image here or click to browse</p>
        <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, GIF, SVG</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {/* Add Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full mb-3 flex items-center justify-center gap-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <Plus className="w-4 h-4" />
        Add Image from Computer
      </Button>

      {/* URL Input */}
      <div className="border-t pt-3">
        <p className="text-xs text-gray-500 mb-2">Or paste image URL:</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 h-8 text-sm border rounded px-2"
          />
          <Button
            size="sm"
            className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              if (imageUrl.trim()) onInsert(imageUrl.trim());
            }}
            disabled={!imageUrl.trim()}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Link Insert/Edit Dialog                                            */
/* ------------------------------------------------------------------ */
interface LinkDialogProps {
  initialUrl: string;
  initialText: string;
  hasSelection: boolean;
  onInsert: (url: string, text: string) => void;
  onClose: () => void;
}

const LinkDialog: React.FC<LinkDialogProps> = ({ initialUrl, initialText, hasSelection, onInsert, onClose }) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-xl z-50 p-4 min-w-[320px]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800">
          {initialUrl ? 'Edit Link' : 'Insert Link'}
        </h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-3">
        {/* Link Text (only show if no selection) */}
        {!hasSelection && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Display Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Link text"
              className="w-full h-8 text-sm border rounded px-2"
            />
          </div>
        )}

        {/* URL */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full h-8 text-sm border rounded px-2"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              if (url.trim()) {
                const finalUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
                onInsert(finalUrl, text.trim());
              }
            }}
            disabled={!url.trim()}
          >
            {initialUrl ? 'Update' : 'Insert'}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Table Alignment Toolbar (shown when cursor is inside a table)      */
/* ------------------------------------------------------------------ */
interface TableToolbarProps {
  editor: ReturnType<typeof useEditor>;
}

const TableContextToolbar: React.FC<TableToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 border-l pl-2 ml-2">
      {/* Table alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
        title="Align table content left"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
        title="Align table content center"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
        title="Align table content right"
      >
        <AlignRight className="w-3.5 h-3.5" />
      </Button>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Add/Delete rows & columns */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Add column after"
      >
        <MoveHorizontal className="w-3.5 h-3.5" />
        <Plus className="w-2.5 h-2.5 -ml-0.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Add row after"
      >
        <MoveVertical className="w-3.5 h-3.5" />
        <Plus className="w-2.5 h-2.5 -ml-0.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="Delete column"
        className="text-red-500 hover:text-red-700"
      >
        <Columns className="w-3.5 h-3.5" />
        <X className="w-2.5 h-2.5 -ml-0.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="Delete row"
        className="text-red-500 hover:text-red-700"
      >
        <Rows className="w-3.5 h-3.5" />
        <X className="w-2.5 h-2.5 -ml-0.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="Delete table"
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Rich Text Editor                                              */
/* ------------------------------------------------------------------ */
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
}) => {
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'rte-bullet-list',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'rte-ordered-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'rte-list-item',
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'rte-link',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'tableCell', 'tableHeader'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rte-content focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  if (!editor) return null;

  const isInsideTable = editor.isActive('table');

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTableDialog(false);
  };

  const insertImage = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
    setShowImageDialog(false);
  };

  const handleLinkInsert = (url: string, text: string) => {
    if (editor.state.selection.empty && text) {
      // No selection: insert new text with link
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`)
        .run();
    } else {
      // Has selection: convert selected text to link
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setShowLinkDialog(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setHighlightColor = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  // Get current link info for the dialog
  const getCurrentLinkUrl = () => {
    const attrs = editor.getAttributes('link');
    return attrs.href || '';
  };

  const getSelectedText = () => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, '');
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* ── Toolbar ── */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
        {/* Text Formatting */}
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200' : ''}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200' : ''}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-gray-200' : ''}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-gray-200' : ''}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>

        {/* Block Elements */}
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>

        {/* Link */}
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowLinkDialog(!showLinkDialog);
                setShowImageDialog(false);
                setShowTableDialog(false);
              }}
              title="Insert/Edit Link"
              className={editor.isActive('link') ? 'bg-blue-100 text-blue-700' : showLinkDialog ? 'bg-gray-200' : ''}
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
            {showLinkDialog && (
              <LinkDialog
                initialUrl={getCurrentLinkUrl()}
                initialText={getSelectedText()}
                hasSelection={!editor.state.selection.empty}
                onInsert={handleLinkInsert}
                onClose={() => setShowLinkDialog(false)}
              />
            )}
          </div>
          {editor.isActive('link') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveLink}
              title="Remove Link"
              className="text-red-500 hover:text-red-700"
            >
              <Unlink className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Text Colors */}
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <Button variant="ghost" size="sm" onClick={() => setTextColor('#000000')} title="Black">
            <div className="w-4 h-4 bg-black rounded" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setTextColor('#dc2626')} title="Red">
            <div className="w-4 h-4 bg-red-600 rounded" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setTextColor('#2563eb')} title="Blue">
            <div className="w-4 h-4 bg-blue-600 rounded" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setTextColor('#16a34a')} title="Green">
            <div className="w-4 h-4 bg-green-600 rounded" />
          </Button>
        </div>

        {/* Highlights */}
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <Button variant="ghost" size="sm" onClick={() => setHighlightColor('#fef08a')} title="Yellow Highlight">
            <div className="w-4 h-4 bg-yellow-200 rounded border" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setHighlightColor('#bfdbfe')} title="Blue Highlight">
            <div className="w-4 h-4 bg-blue-200 rounded border" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setHighlightColor('#bbf7d0')} title="Green Highlight">
            <div className="w-4 h-4 bg-green-200 rounded border" />
          </Button>
        </div>

        {/* Image & Table (with dialogs) */}
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowImageDialog(!showImageDialog);
                setShowTableDialog(false);
                setShowLinkDialog(false);
              }}
              title="Insert Image"
              className={showImageDialog ? 'bg-gray-200' : ''}
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            {showImageDialog && (
              <ImageUploadDialog
                onInsert={insertImage}
                onClose={() => setShowImageDialog(false)}
              />
            )}
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowTableDialog(!showTableDialog);
                setShowImageDialog(false);
                setShowLinkDialog(false);
              }}
              title="Insert Table"
              className={showTableDialog ? 'bg-gray-200' : ''}
            >
              <TableIcon className="w-4 h-4" />
            </Button>
            {showTableDialog && (
              <TableInsertDialog
                onInsert={insertTable}
                onClose={() => setShowTableDialog(false)}
              />
            )}
          </div>
        </div>

        {/* Undo / Redo */}
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        {/* Table context toolbar (only visible when cursor is inside a table) */}
        {isInsideTable && <TableContextToolbar editor={editor} />}
      </div>

      {/* ── Editor Content ── */}
      <EditorContent editor={editor} className="min-h-[200px] max-h-[400px] overflow-y-auto" />

      {/* ── Editor Styles ── */}
      <style>{`
        /* ===== Rich Text Editor Content Styles ===== */
        .rte-content {
          font-size: 14px;
          line-height: 1.6;
          color: #1f2937;
        }

        /* ===== Bullet List ===== */
        .ProseMirror ul,
        .ProseMirror .rte-bullet-list {
          list-style-type: disc !important;
          padding-left: 1.5em !important;
          margin: 0.5em 0 !important;
        }
        .ProseMirror ul ul {
          list-style-type: circle !important;
        }
        .ProseMirror ul ul ul {
          list-style-type: square !important;
        }

        /* ===== Ordered List ===== */
        .ProseMirror ol,
        .ProseMirror .rte-ordered-list {
          list-style-type: decimal !important;
          padding-left: 1.5em !important;
          margin: 0.5em 0 !important;
        }
        .ProseMirror ol ol {
          list-style-type: lower-alpha !important;
        }
        .ProseMirror ol ol ol {
          list-style-type: lower-roman !important;
        }

        /* ===== List Items ===== */
        .ProseMirror li,
        .ProseMirror .rte-list-item {
          margin: 0.25em 0 !important;
          display: list-item !important;
        }
        .ProseMirror li p {
          margin: 0 !important;
        }
        .ProseMirror li::marker {
          color: #374151;
        }

        /* ===== Links ===== */
        .ProseMirror a,
        .ProseMirror .rte-link {
          color: #2563eb !important;
          text-decoration: underline !important;
          cursor: pointer;
          transition: color 0.15s;
        }
        .ProseMirror a:hover,
        .ProseMirror .rte-link:hover {
          color: #1d4ed8 !important;
        }

        /* ===== Headings ===== */
        .ProseMirror h1 { font-size: 1.75em; font-weight: 700; margin: 0.75em 0 0.5em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: 600; margin: 0.75em 0 0.5em; }
        .ProseMirror h3 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0 0.25em; }

        /* ===== Paragraphs ===== */
        .ProseMirror p {
          margin: 0.4em 0;
        }

        /* ===== Blockquote ===== */
        .ProseMirror blockquote {
          border-left: 3px solid #d1d5db;
          padding-left: 1em;
          margin: 0.75em 0;
          color: #6b7280;
          font-style: italic;
        }

        /* ===== Code Block ===== */
        .ProseMirror pre {
          background: #1f2937;
          color: #e5e7eb;
          border-radius: 6px;
          padding: 0.75em 1em;
          font-family: 'Fira Code', monospace;
          font-size: 0.9em;
          overflow-x: auto;
          margin: 0.75em 0;
        }
        .ProseMirror code {
          background: #f3f4f6;
          padding: 0.15em 0.3em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        .ProseMirror pre code {
          background: none;
          padding: 0;
        }

        /* ===== Table styles ===== */
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
          table-layout: fixed;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          border: 1px solid #d1d5db;
          padding: 8px 12px;
          position: relative;
          vertical-align: top;
          min-width: 80px;
        }
        .ProseMirror table th {
          background-color: #f3f4f6;
          font-weight: 600;
          text-align: left;
        }
        .ProseMirror table td > *,
        .ProseMirror table th > * {
          margin: 0;
        }
        /* Selected cell highlight */
        .ProseMirror table .selectedCell {
          background-color: #dbeafe;
        }
        /* Column resize handle */
        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #3b82f6;
          cursor: col-resize;
          z-index: 20;
        }

        /* ===== Text alignment ===== */
        .ProseMirror [style*="text-align: center"] { text-align: center; }
        .ProseMirror [style*="text-align: right"]  { text-align: right; }
        .ProseMirror [style*="text-align: justify"]{ text-align: justify; }

        /* ===== Image styling ===== */
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 0.5rem 0;
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid #3b82f6;
          border-radius: 8px;
        }

        /* ===== Placeholder ===== */
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        /* ===== Horizontal Rule ===== */
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 1em 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;