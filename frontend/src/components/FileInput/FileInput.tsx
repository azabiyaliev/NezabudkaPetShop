import Grid from "@mui/material/Grid2";
import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  name: string;
  label: string;
  onGetFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialValue: File | string | null;
}

const FileInput: React.FC<Props> = ({ name, label, onGetFile, initialValue }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (initialValue) {
      setFileName(initialValue instanceof File ? initialValue.name : initialValue);
    } else {
      setFileName("");
    }
  }, [initialValue]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }

    onGetFile(e);
  };

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        style={{ display: "none" }}
        type="file"
        name={name}
        onChange={onFileChange}
        ref={inputRef}
      />
      <Grid container spacing={2} direction="row" alignItems="center">
        <Grid size={{ xs: 9 }}>
          <TextField
            label={label}
            slotProps={{ input: { readOnly: true } }}
            value={fileName}
            onClick={activateInput}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid size={{ xs: 3 }}>
          <Button
            variant="contained"
            onClick={activateInput}
            sx={{
              color: "white",
              textTransform: "uppercase",
              background: "#237803",
              width: "100%",
              fontSize: "0.75rem",
              padding: "6px 12px",
            }}
          >
            Выбрать изображение
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInput;
