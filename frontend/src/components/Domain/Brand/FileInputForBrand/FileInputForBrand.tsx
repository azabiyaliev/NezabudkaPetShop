import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';

interface Props {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
  label: string;
  initialValue: File | string | null;
}

const FileInputForBrand: React.FC<Props> = ({
  onChange,
  name,
  label,
  initialValue,
}) => {
  const [filename, setFilename] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialValue) {
      setFilename(initialValue instanceof File ? initialValue.name : initialValue);
    } else {
      setFilename("");
    }
  }, [initialValue]);

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilename(e.target.files[0].name);
    } else {
      setFilename("");
    }

    onChange(e);
  };

  return (
    <>
      <input
        type="file"
        name={name}
        style={{ display: "none" }}
        ref={inputRef}
        onChange={onFileChange}
      />
      <Grid container spacing={2} alignItems="center">
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
        >
          <Box sx={{ width: "70%" }}>
            <TextField
              sx={{ width: "100%" }}
              label={label}
              slotProps={{ input: { readOnly: true } }}
              value={filename}
              onClick={activateInput}
            />
          </Box>
          <Box sx={{ width: "30%" }}>
            <Button
              variant="text"
              onClick={activateInput}
              sx={{
                color: "white",
                width: "100%",
                height: "50px",
                background:
                  "linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)",
              }}
            >
              Выбрать изображение
            </Button>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default FileInputForBrand;
