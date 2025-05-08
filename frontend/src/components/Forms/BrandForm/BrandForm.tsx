import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import React, { useState } from 'react';
import { BrandError, IBrandForm } from '../../../types';
import FileInputForBrand from '../../Domain/Brand/FileInputForBrand/FileInputForBrand.tsx';
import { Alert, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import ButtonSpinner from '../../UI/ButtonSpinner/ButtonSpinner.tsx';
import { apiUrl } from '../../../globalConstants.ts';
import TextEditor from '../../TextEditor/TextEditor.tsx';
import { Box } from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  addNewBrand: (brand: IBrandForm) => void;
  isLoading?: boolean;
  editBrand?: IBrandForm;
  isBrand?: boolean;
  brandError: BrandError | null;
}

const initialBrand = {
  title: "",
  logo: null,
  description: "",
};

const BrandForm: React.FC<Props> = ({
  addNewBrand,
  isLoading,
  editBrand = initialBrand,
  isBrand = false,
  brandError,
}) => {
  const [newBrand, setNewBrand] = useState<IBrandForm>(editBrand);
  const [titleError, setTitleError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewBrand((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "title") setTitleError("");
    if (name === "title" && value.trim() === "") {
      setTitleError("Название бренда является обязательным полем и не может быть пустым.");
    }
  };

  const onChangeEditor = (html: string) => {
    const clearTags = html.replace(/<\/?p>/g, '');
    setNewBrand((prevState) => ({
      ...prevState,
      description: clearTags,
    }));
  };

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addNewBrand({
      ...newBrand,
      logo: newBrand.logo instanceof File ? newBrand.logo : newBrand.logo, });
  };

  const fileInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    const value = files && files[0] ? files[0] : null;

    setNewBrand((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const deleteLogo = () => {
    setNewBrand({
      ...newBrand,
      logo: null,
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        margin: '20px 30px',
      }}
    >
      <main>
        <Sheet
          sx={{
            maxWidth: 1200,
            padding: '30px 20px',
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
            backgroundColor: "transparent",
          }}
          variant="outlined"
        >
          {brandError && brandError.errors ?
            <Alert severity="error" sx={{ width: "100%" }}>
              {brandError.errors.title}
            </Alert> : null
          }
          <FormControl>
            <TextField
              sx={{ width: "100%" }}
              id="outlined-basic"
              label="Название бренда"
              name="title"
              variant="outlined"
              value={newBrand.title}
              onChange={onChange}
              error={Boolean(titleError || (brandError && brandError.message))}
              helperText={titleError || (brandError && brandError.message)}
            />
          </FormControl>
          <TextEditor value={newBrand.description} onChange={onChangeEditor}/>
          <FileInputForBrand
            label="Выберите изображение для логотипа бренда"
            name="logo"
            onChange={fileInputChangeHandler}
            initialValue={newBrand.logo !== null ? newBrand.logo : ""}
          />
          {newBrand.logo && (
            <Box sx={{
              display: "flex",
            }}>
              <img
                style={{
                  width: "200px",
                  height: "200px",
                  textIndent: "-9999px",
                  display: "block",
                  objectFit: "contain",
                }}
                src={
                  newBrand.logo instanceof File
                    ? URL.createObjectURL(newBrand.logo)
                    : apiUrl + newBrand.logo
                }
                alt={newBrand.title}
              />
              <CloseIcon onClick={() => deleteLogo()}/>
            </Box>
          )}
          <Button
            variant="text"
            sx={{
              color: "white",
              textTransform: "uppercase",
              border: newBrand.title.trim().length === 0 ? "1px solid lightgrey" : null,
              background: isLoading || newBrand.title.trim().length === 0
                ? "transparent"
                : "linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)",
            }}
            type="submit"
            disabled={isLoading || newBrand.title.trim().length === 0}
          >
            {!isBrand ? "Создать" : "Сохранить"}
            {isLoading ? <ButtonSpinner /> : null}
          </Button>
        </Sheet>
      </main>
    </form>
  );
};

export default BrandForm;
