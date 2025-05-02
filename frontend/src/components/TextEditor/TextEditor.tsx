import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Box, Paper, Typography } from "@mui/material";
import './styles.css'

interface Props {
  value: string;
  onChange: (html: string) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  validateDeliveryPriceInfo?: string;
}

export const deliveryPriceInfoTemplate =
  "Ленинский – 0 сом " +
  "Первомайский - 0 сом " +
  "Свердловский – 0 сом " +
  "Октябрьский - 0 сом"

const TextEditor: React.FC<Props> = ({ value, onChange, error = false, helperText, placeholder = "Введите описание", validateDeliveryPriceInfo = deliveryPriceInfoTemplate }) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const editorInstance = useRef<Quill | null>(null);
  const lastSetValue = useRef<string>("");

  const isContentEmpty = (html: string) => {
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return stripped.length === 0;
  };

  useEffect(() => {
    if (quillRef.current && !editorInstance.current) {
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ 'header': [] }, { 'font': [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline", "strike"],
            [{ align: [] }],
            ["link", "image", "video"],
            [{ color: [] }, { background: [] }],
            ["blockquote", "code-block"],
          ],
        },
      });

      editorInstance.current = quill;

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        if (!isContentEmpty(html)) {
          onChange(html);
          lastSetValue.current = html;
        } else {
          onChange("");
          lastSetValue.current = "";
        }
      });
    }
  }, [onChange, placeholder]);

  useEffect(() => {
    const quill = editorInstance.current;
    if (quill && value !== lastSetValue.current) {
      const selection = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(value);
      if (selection) {
        quill.setSelection(selection);
      }
      lastSetValue.current = value;
    }
  }, [value]);

  if (validateDeliveryPriceInfo !== deliveryPriceInfoTemplate) return helperText ? <Typography variant="body2" color="error" sx={{ mt: 1, ml: 1 }}>{helperText}</Typography> : null;

  return (
    <Box>
      {error && helperText && (
        <Typography variant="body2" color="error" sx={{ mt: 1, ml: 1 }}>
          {helperText}
        </Typography>
      )}
      <Paper elevation={3}>
        <div ref={quillRef} style={{ height: "200px", borderRadius: "4px" }} />
      </Paper>
    </Box>
  );
};

export default TextEditor;
