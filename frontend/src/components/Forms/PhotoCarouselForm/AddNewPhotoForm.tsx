import React, { useState } from 'react';
import { PhotoForm } from '../../../types';
import { useAppDispatch } from '../../../app/hooks.ts';
import { addNewPhoto, fetchPhoto } from '../../../store/photoCarousel/photoCarouselThunk.ts';
import { enqueueSnackbar } from 'notistack';
import { Box, Button, Paper, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import FileInput from '../../UI/FileInput/FileInput.tsx';
import { apiUrl } from '../../../globalConstants.ts';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../../globalStyles/globalTheme.ts';

const initialState = {
  link: "",
  photo: null,
  title: "",
  description: "",
};

const AddNewPhotoForm = () => {
  const [newPhoto, setNewPhoto] = useState<PhotoForm>({ ...initialState });
  const dispatch = useAppDispatch();
  const [linkError, setLinkError] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [descError, setDescError] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      await dispatch(addNewPhoto(newPhoto)).unwrap();
      enqueueSnackbar('Вы успешно добавили новое фото в карусель;)', { variant: 'success' });
      resetForm();
      await dispatch(fetchPhoto()).unwrap();
    } catch (e) {
      console.error("Error during form submission:", e);
    }
  };

  const resetForm = () => {
    setNewPhoto({ ...initialState });
    setLinkError("");
    setTitleError("");
    setDescError("");
    setIsSubmitted(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'link' && value.trim() !== "") setLinkError("");
    if (name === 'title' && value.trim() !== "") setTitleError("");
    if (name === 'description' && value.trim() !== "") setDescError("");

    setNewPhoto((prevState) => ({ ...prevState, [name]: value }));

    if (name === 'link' && value.trim() === "") setLinkError("Поле для ссылки не может быть пустым");
    if (name === 'description' && value.trim() === "") setDescError("Поле для описания не может быть пустым");
    if (name === 'title' && value.trim() === "") setTitleError("Поле для заголовка не может быть пустым");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setNewPhoto((prevState: PhotoForm) => ({
        ...prevState,
        [name]: files[0],
      }));
    }
  };

  const deletePhoto = () => {
    setNewPhoto((prev) => ({
      ...prev,
      photo: null,
    }));
    setIsSubmitted(true);
  }

  const isButtonFormInvalid =
    !newPhoto.link.trim() ||
    !newPhoto.title.trim() ||
    !newPhoto.description.trim() ||
    !newPhoto.photo ||
    Boolean(linkError) ||
    Boolean(titleError) ||
    Boolean(descError);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb:3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 700,
          borderRadius: 3,
          backgroundColor: theme.colors.white,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Typography  gutterBottom sx={{ textAlign: 'center', fontWeight: theme.fonts.weight.medium, mb:"10px" }}>
          Добавить фото для карусели
        </Typography>

        <form onSubmit={onFormSubmit}>
          <TextField
            fullWidth
            label="Ссылка"
            name="link"
            variant="outlined"
            value={newPhoto.link}
            onChange={onInputChange}
            error={Boolean(linkError)}
            helperText={linkError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />

          <FileInput
            id="photo"
            name="photo"
            label="Фото"
            onGetFile={onFileChange}
            file={newPhoto.photo}
            error={isSubmitted && !newPhoto.photo}
            helperText={isSubmitted && !newPhoto.photo ? 'Фото обязательно для загрузки' : undefined}
          />

          <TextField
            fullWidth
            label="Заголовок"
            name="title"
            variant="outlined"
            value={newPhoto.title}
            onChange={onInputChange}
            error={Boolean(titleError)}
            helperText={titleError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.exs,
            }}
          />

          <TextField
            fullWidth
            label="Описание"
            name="description"
            variant="outlined"
            multiline
            minRows={2}
            value={newPhoto.description}
            onChange={onInputChange}
            error={Boolean(descError)}
            helperText={descError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />

          {newPhoto.photo && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src={newPhoto.photo instanceof File ? URL.createObjectURL(newPhoto.photo) : apiUrl + newPhoto.photo}
                alt="Превью фото"
                style={{
                  width: '200px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: theme.spacing.exs,
                  marginRight: theme.spacing.xs,
                  marginTop: theme.spacing.sm
                }}
              />
              <CloseIcon
                onClick={deletePhoto}
                sx={{
                  cursor: 'pointer',
                  color: 'red',
                  '&:hover': { color: 'darkred' },
                }}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={isButtonFormInvalid}
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: isButtonFormInvalid ? theme.colors.rgbaGrey : theme.colors.primary,
                color: theme.colors.white,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Добавить
            </Button>

            <Button
              onClick={resetForm}
              sx={{
                color: 'red',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Отмена
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddNewPhotoForm;
