import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import React, { useState } from 'react';
import { IBrandForm } from '../../../types';
import FileInputForBrand from '../FileInputForBrand/FileInputForBrand.tsx';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';

interface Props {
  addNewBrand: (brand: IBrandForm) => void;
}

const brandState = {
  title: '',
  logo: null,
};

const BrandForm:React.FC<Props> = ({addNewBrand}) => {
  const [newBrand, setNewBrand] = useState<IBrandForm>(brandState);

  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setNewBrand((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newBrand.title.trim().length === 0) {
      toast.error('Заполните название бренда');
      return;
    }

    if (!newBrand.logo) {
      toast.error('Выберите изображение для логотипа бренда!');
      return;
    }

    addNewBrand({...newBrand});
  };

  const fileInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    const value = files && files[0] ? files[0] : null;

    setNewBrand((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const imageUrl = newBrand.logo ? URL.createObjectURL(newBrand.logo) : '';

  return (
    <form onSubmit={onSubmit}>
      <main>
        <Sheet
          sx={{
            width: 800,
            mx: 'auto',
            my: 4,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
            backgroundColor: 'transparent'
          }}
          variant="outlined"
        >
          <div>
            <Typography level="h2" component="h1"
              sx={{textAlign: 'center', margin: '10px 0'}}
            >
              Добавление нового бренда
            </Typography>
          </div>
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
          <FileInputForBrand label="Выберите изображение для логотипа бренда" name="logo" onChange={fileInputChangeHandler} />
          {newBrand.logo !== null && (
            <img
              style={{
                width: '200px',
                height: '200px',
                textIndent: '-9999px',
                display: 'block',
              }}
              src={imageUrl}
              alt={newBrand.title}
            />
          )}
          <Button
            variant="text"
            sx={{
              color: 'white',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)',
            }}
            type='submit'
            // disabled={loading}
          >
            Создать
            {/*{loading ? <ButtonSpinner/> : null}*/}
          </Button>
        </Sheet>
      </main>
    </form>
  );
};

export default BrandForm;