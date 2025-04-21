import Grid from "@mui/material/Grid2";
import { Button, TextField } from "@mui/material";
import React, { useRef, useState } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface Props {
  name: string;
  label: string;
  onGetFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInputCategory: React.FC<Props> = ({ name, label, onGetFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");


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
        style={{ display: "none"}}
        type="file"
        name={name}
        onChange={onFileChange}
        ref={inputRef}
      />
      <Grid container spacing={2} direction="row" alignItems="stretch">
        <Grid>
          <TextField
            label={label}
            slotProps={{ input: { readOnly: true } }}
            value={fileName}
            onClick={activateInput}
            sx={{ width: '100%', height: '100%' }}
          />
        </Grid>
        <Grid>
          <Button
            variant="contained"
            onClick={activateInput}
            sx={{
              color: "white",
              textTransform: "uppercase",
              background: "white",
              height: '100%',
              border: "1px solid #237803",
              padding: "6px 12px",
              display: "flex",
              borderRadius: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddPhotoAlternateIcon sx={{ color: "#237803" }} />
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInputCategory;
