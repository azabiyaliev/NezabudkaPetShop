import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface Props {
  name: string;
  label: string;
  onGetFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | string | null;
  id: string;
  className?: string;
  error?: boolean;
  helperText?: string;
}

const FileInput: React.FC<Props> = ({
  name,
  label,
  onGetFile,
  file,
  id,
  className,
  error,
  helperText,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const activateInput = () => inputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      onGetFile(e);
    }
  };

  useEffect(() => {
    if (!file) {
      setFileName("");
    } else if (file instanceof File) {
      setFileName(file.name);
    } else if (typeof file === "string") {
      const parts = file.split("/");
      setFileName(parts[parts.length - 1]);
    }
  }, [file]);

  return (
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <input
        type="file"
        name={name}
        ref={inputRef}
        onChange={onFileChange}
        style={{ display: "none" }}
      />

      <InputLabel htmlFor={id}>{label}</InputLabel>

      <OutlinedInput
        id={id}
        className={className}
        label={label}
        readOnly
        value={fileName}
        onClick={activateInput}
        endAdornment={
          <Button
            onClick={(e) => {
              e.stopPropagation();
              activateInput();
            }}
            sx={{
              minWidth: "40px",
              padding: "4px",
              color: error ? "#FF0000" : "#1976d2",
            }}
          >
            <AddPhotoAlternateIcon sx={{color: "gray"}} />
          </Button>
        }
        sx={{ cursor: "pointer", backgroundColor: "white" }}
      />

      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FileInput;
