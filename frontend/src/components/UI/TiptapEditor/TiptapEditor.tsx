import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline'
import './styles.css'

interface Props {
  content: string;
  onChange: (html: string) => void;
}

const TiptapEditor: React.FC<Props> = ({content, onChange}) => {

  const editor = useEditor({
    extensions: [StarterKit,
      Underline,
      Placeholder.configure({
      placeholder: 'Введите описание',
    })],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="control-group">
        <div className="button-group">
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            <em>I</em>
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'is-active' : ''}
          >
            <u>U</u>
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            <s>S</s>
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleCode().run();
            }}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleCode()
                .run()
            }
            className={editor.isActive('code') ? 'is-active' : ''}
          >
            code
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleCodeBlock().run();
            }}
            className={editor.isActive('codeBlock') ? 'is-active' : ''}
          >
            code block
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().setParagraph().run();
            }}
            className={editor.isActive('paragraph') ? 'is-active' : ''}
          >
            P
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          >
            h1
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          >
            h2
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          >
            h3
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 4 }).run();
            }}
            className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
          >
            h4
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 5 }).run();
            }}
            className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
          >
            h5
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 6 }).run();
            }}
            className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
          >
            h6
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            ul
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            ol
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleBlockquote().run();
            }}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
          >
            bq
          </button>
          <button onClick={(event) => {
            event.preventDefault();
            editor.chain().focus().setHorizontalRule().run();
          }}>
            hr
          </button>
          <button onClick={(event) => {
            event.preventDefault();
            editor.chain().focus().setHardBreak().run();
          }}>
            hard break
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().undo().run();
            }}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .undo()
                .run()
            }
          >
            undo
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().redo().run();
            }}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .redo()
                .run()
            }
          >
            redo
          </button>
        </div>
      </div>
      <EditorContent editor={editor} className={'editor-content'} />
    </>
  );
};

export default TiptapEditor;