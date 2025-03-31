import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import './styles.css'

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const QuillEditor: React.FC<Props> = ({ value, onChange }) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const editorInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !editorInstance.current) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ 'header': [] }, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'align': [] }],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }],
            ['blockquote', 'code-block'],
          ],
        },
      });

      editorInstance.current = quill;

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });

      quill.root.innerHTML = value;
    }
  }, [value, onChange]);

  return <div ref={quillRef} style={{ minHeight: "200px" }} />;
};

export default QuillEditor;
