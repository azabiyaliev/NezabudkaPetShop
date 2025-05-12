import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import theme from "../../../../globalStyles/globalTheme.ts";

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
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%",
            '@media (max-width: 560px)': {
              display: "block",
            },
          }}
        >
          <Box sx={{ width: "70%",
            '@media (max-width: 560px)': {
              width: "100%",
            },
          }}>
            <TextField
              sx={{ width: "100%" }}
              label={label}
              slotProps={{ input: { readOnly: true } }}
              value={filename}
              onClick={activateInput}
            />
          </Box>
          <Box sx={{ width: "30%",
            '@media (max-width: 560px)': {
              width: "100%",
              mt: 1
            },
          }}>
            <Button
              variant="contained"
              onClick={activateInput}
              sx={{
                background: theme.colors.white,
                border: `1px solid ${theme.colors.primary} `,
                borderRadius: theme.spacing.exs,
                height: '100%',
                padding: "13px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddPhotoAlternateIcon sx={{ color: theme.colors.primary }} />
            </Button>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default FileInputForBrand;
