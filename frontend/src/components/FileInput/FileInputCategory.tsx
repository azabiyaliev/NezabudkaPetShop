import Grid from "@mui/material/Grid2";
import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import theme from '../../globalStyles/globalTheme.ts';

interface Props {
  name: string;
  label: string;
  onGetFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | string | null;
  id: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const FileInputCategory: React.FC<Props> = ({ name, label, onGetFile, file, inputRef }) => {
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (file instanceof File) {
      setFileName(file.name);
    } else if (typeof file === "string") {
      const urlParts = file.split('/');
      setFileName(urlParts[urlParts.length - 1]);
    } else {
      setFileName("");
    }
  }, [file]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
    onGetFile(e);
  };

  const activateInput = () => {
    if (inputRef?.current) {
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
      <Grid container spacing={2} direction="row" alignItems="stretch">
        <Grid>
          <TextField
            label={label}
            value={fileName}
            onClick={activateInput}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid>
          <Button
            variant="contained"
            onClick={activateInput}
            sx={{
              background: theme.colors.white,
              border: `1px solid ${theme.colors.primary} `,
              borderRadius: theme.spacing.exs,
              height: '100%',
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddPhotoAlternateIcon sx={{ color: theme.colors.primary }} />
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInputCategory;
