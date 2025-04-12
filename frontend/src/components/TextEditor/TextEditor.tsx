import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Box, Paper } from "@mui/material";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const TextEditor: React.FC<Props> = ({ value, onChange }) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const editorInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !editorInstance.current) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }, { 'size': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            [{ 'color': [] }, { 'background': [] }],
            ['blockquote', 'code-block'],
            ['clean'],
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

  useEffect(() => {
    if (editorInstance.current) {
      editorInstance.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <div ref={quillRef} style={{ height: "200px", borderRadius: "4px" }} />
      </Paper>
    </Box>
  );
};

export default TextEditor;