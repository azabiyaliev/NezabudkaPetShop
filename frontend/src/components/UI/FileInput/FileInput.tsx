import React, { useEffect, useRef, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Box, Button, FormHelperText } from "@mui/material";

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
  const [touched, setTouched] = useState(false);

  const activateInput = () => {
    inputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTouched(true);

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

  const finalHelperText = helperText || "Фото обязательно для загрузки";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      <input
        style={{ display: "none" }}
        type="file"
        name={name}
        ref={inputRef}
        onChange={onFileChange}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          id={id}
          className={className}
          onClick={activateInput}
          sx={{
            padding: "15px 30px",
            borderRadius: "20px",
            border: `1px solid ${error || (touched && !fileName) ? "#FF0000" : "darkgreen"}`,
            backgroundColor: "white",
            width: "240px",
            maxWidth: "100%",
            cursor: "pointer",
            userSelect: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "@media (max-width: 600px)": {
              padding: "12px 20px",
            },
          }}
        >
          {fileName || label}
        </Box>

        <Button
          variant="outlined"
          onClick={activateInput}
          sx={{
            borderColor: error || (touched && !fileName) ? "#FF0000" : "darkgreen",
            borderRadius: "15px",
            backgroundColor: "white",
            padding: "15px 20px",
            cursor: "pointer",
            color: error || (touched && !fileName) ? "#FF0000" : "darkgreen",
            minWidth: "50px",
            "@media (max-width: 600px)": {
              padding: "10px 15px",
            },
          }}
        >
          <AddPhotoAlternateIcon />
        </Button>
      </Box>

      {(error || (touched && !fileName)) && (
        <FormHelperText
          sx={{
            color: "#FF0000",
            fontSize: "12px",
            marginTop: "-10px",
            marginLeft: "10px",
            marginBottom: "10px",
          }}
        >
          {finalHelperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FileInput;
