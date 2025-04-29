import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
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
  error = false,
  helperText,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const activateInput = () => {
    inputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFileName(selectedFile.name);
    } else {
      setFileName("");
    }

    onGetFile(e);
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

  const isError = error;
  const finalHelperText = helperText || "Фото обязательно для загрузки";

  return (
    <Box sx={{ width: "100%" }}>
      <input
        type="file"
        name={name}
        ref={inputRef}
        onChange={onFileChange}
        style={{ display: "none" }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
        <FormControl error={isError} fullWidth>
          <TextField
            id={id}
            label={label}
            variant="outlined"
            size="small"
            fullWidth
            value={fileName}
            onClick={activateInput}
            InputProps={{ readOnly: true }}
            className={className}
          />
          {isError && finalHelperText && (
            <FormHelperText>{finalHelperText}</FormHelperText>
          )}
        </FormControl>

        <Button
          onClick={activateInput}
          variant="outlined"
          sx={{
            minWidth: "50px",
            padding: "8px",
            borderRadius: "8px",
            borderColor: isError ? "#FF0000" : "gray",
            color: isError ? "#FF0000" : "gray",
          }}
        >
          <AddPhotoAlternateIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default FileInput;
