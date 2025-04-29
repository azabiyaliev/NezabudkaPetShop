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
  onGetFile: (file: File) => void;
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
  const [touched, setTouched] = useState(false);

  const activateInput = () => {
    inputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTouched(true);

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFileName(selectedFile.name);
      onGetFile(selectedFile);
    } else {
      setFileName("");
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

  const isError = error || (touched && !fileName);
  const finalHelperText = helperText || "Фото обязательно для загрузки";

  return (
    <FormControl fullWidth size="small" error={isError} sx={{ mb: 2 }}>
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
            onClick={activateInput}
            sx={{
              minWidth: "40px",
              padding: "4px",
              color: isError ? "#FF0000" : "#1976d2",
            }}
          >
            <AddPhotoAlternateIcon />
          </Button>
        }
        sx={{ cursor: "pointer", backgroundColor: "white" }}
      />

      {isError && <FormHelperText>{finalHelperText}</FormHelperText>}
    </FormControl>
  );
};

export default FileInput;
