import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useTheme } from '@mui/material/styles';
import theme from '../../../globalStyles/globalTheme.ts';

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
  const usetheme = useTheme();

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
        style={{ display: "none"}}
      />

      <InputLabel sx={{ mt:theme.spacing.sm}} htmlFor={id}>{label}</InputLabel>

      <OutlinedInput
        id={id}
        className={className}
        label={label}
        readOnly
        value={fileName}
        onClick={activateInput}
        error={error}
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
            <AddPhotoAlternateIcon sx={{color: theme.colors.primary}} />
          </Button>
        }
        sx={{ cursor: "pointer", backgroundColor: "white", mt:theme.spacing.sm, p: theme.spacing.exs}}
      />

      {error && (
        <FormHelperText sx={{ color: usetheme.palette.error.main }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default FileInput;
