import Grid from "@mui/material/Grid2";
import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/joy';
import theme from '../../globalStyles/globalTheme.ts';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

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
      <Grid container spacing={2} direction="row" alignItems="center" sx={{
        '@media (max-width:630px)': {
          display: "none",
        },
      }}>
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
              background: theme.colors.white,
              border: `1px solid ${theme.colors.primary} `,
              borderRadius: theme.spacing.exs,
              height: '100%',
              padding: "12px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddPhotoAlternateIcon sx={{ color: theme.colors.primary }} />
          </Button>
        </Grid>
      </Grid>
      <Box sx={{
        display: "none",
        '@media (max-width: 630px)': {
          display: "block",
        },
      }}>
        <Box>
          <TextField
            label={label}
            slotProps={{ input: { readOnly: true } }}
            value={fileName}
            onClick={activateInput}
            sx={{ width: '100%' }}
          />
        </Box>
        <Box sx={{
          marginTop: '10px'
        }}>
          <Button
            variant="contained"
            onClick={activateInput}
            sx={{
              background: theme.colors.white,
              border: `1px solid ${theme.colors.primary} `,
              borderRadius: theme.spacing.exs,
              height: '100%',
              padding: "12px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddPhotoAlternateIcon sx={{ color: theme.colors.primary }} />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default FileInput;
