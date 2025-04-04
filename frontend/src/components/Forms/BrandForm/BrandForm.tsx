import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewBrand((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onChangeEditor = (html: string) => {
    setNewBrand((prevState) => ({
      ...prevState,
      description: html,
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
        marginLeft: '30px'
      }}
    >
      <main>
        <Sheet
          sx={{
            width: 800,
            mx: "auto",
            my: 4,
            py: 3,
            px: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
            backgroundColor: "transparent",
          }}
          variant="outlined"
        >
          <div>
            <Typography
              level="h2"
              component="h1"
              sx={{ textAlign: "center", margin: "10px 0" }}
            >
              {!isBrand ? "Добавление нового" : "Редактирование"} бренда
            </Typography>
          </div>
          {brandError && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {brandError.errors ? brandError.errors.title : brandError.message}
            </Alert>
          )}
          <FormControl>
            <TextField
              sx={{ width: "100%" }}
              id="outlined-basic"
              label="Название бренда"
              name="title"
              variant="outlined"
              value={newBrand.title}
              onChange={onChange}
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
              background: isLoading
                ? "transparent"
                : "linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)",
            }}
            type="submit"
            disabled={isLoading}
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
