import React, { useEffect, useRef, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Box, Input, Button, FormHelperText } from "@mui/material";

interface Props {
  name: string;
  label: string;
  onGetFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
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
    } else {
      setFileName(file.name);
    }
  }, [file]);

  const inputStyle = error || !fileName
    ? {
      backgroundColor: "white",
      borderColor: "#FF0000",
    }
    : {
      backgroundColor: "white",
      borderColor: "darkgreen",
    };

  const finalHelperText = helperText || "Фото обязательно для загрузки";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        "@media (max-width: 600px)": {
          flexDirection: "column",
        },
      }}
    >
      <input
        style={{ ...inputStyle, display: "none" }}
        type="file"
        name={name}
        ref={inputRef}
        onChange={onFileChange}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Input
          id={id}
          className={className}
          disabled
          placeholder={label}
          value={fileName || ""}
          onClick={activateInput}
          sx={{
            padding: "15px 30px",
            borderRadius: "20px",
            border: `1px solid ${error || !fileName ? "#FF0000" : "darkgreen"}`,
            backgroundColor: "white",
            width: "100%",
            "@media (max-width: 600px)": {
              width: "100%",
              padding: "12px 20px",
            },
          }}
        />
        <Button
          variant="outlined"
          onClick={activateInput}
          sx={{
            borderColor: error || !fileName ? "#FF0000" : "darkgreen",
            borderRadius: "15px",
            backgroundColor: "white",
            padding: "15px 20px",
            cursor: "pointer",
            color: error || !fileName ? "#FF0000" : "darkgreen",
            "@media (max-width: 600px)": {
              padding: "10px 15px",
            },
          }}
        >
          <AddPhotoAlternateIcon />
        </Button>
      </Box>

      {(error || !fileName) && (
        <FormHelperText sx={{ color: "#FF0000", fontSize: "12px", marginTop:"-10px", marginLeft: "10px", marginBottom: "10px" }}>
          {finalHelperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FileInput;
