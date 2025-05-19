import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchPhoto, updatePhoto } from '../../../store/photoCarousel/photoCarouselThunk.ts';
import { selectPhotoCarousel } from '../../../store/photoCarousel/photoCarouselSlice.ts';
import { PhotoCarousel } from '../../../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import {
  Box, Button, Paper, Typography, TextField,
} from '@mui/material';
import { apiUrl } from '../../../globalConstants.ts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import FileInput from '../../UI/FileInput/FileInput.tsx';
import theme from '../../../globalStyles/globalTheme.ts';
interface FormEditPhotoProps {
  photoId: number;
}

const FormEditPhoto: React.FC<FormEditPhotoProps> = ({ photoId }) => {
  const photos = useAppSelector(selectPhotoCarousel);
  const navigate = useNavigate();
  const [linkError, setLinkError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editPhoto, setEditPhoto] = useState<PhotoCarousel>({
    id: photoId,
    link: '',
    photo: null,
    order: 0,
    title: "",
    description: "",
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPhoto())
      .unwrap()
  }, [dispatch]);

  useEffect(() => {
    const photoToEdit = photos.find((p) => p.id === photoId);
    if (photoToEdit) {
      setEditPhoto(photoToEdit)
    }
  }, [photos, photoId]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditPhoto((prevState) => ({ ...prevState, [name]: value }));

    if (name === "link") setLinkError("");
    if (name === "link" && value.trim() === "") {
      setLinkError("Поле для ссылки не может быть пустым");
    }

    if (name === "title") setTitle("");
    if (name === "title" && value.trim() === "") {
      setTitle("Поле для заголовка не может быть пустым");
    }

    if (name === "description") setDescription("");
    if (name === "description" && value.trim() === "") {
      setDescription("Поле для описания не может быть пустым");
    }
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      setEditPhoto((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  }

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(updatePhoto({ photo: editPhoto })).unwrap();
      navigate('/private/edit-carousel');
      enqueueSnackbar('Вы отредатировали фото для карусели;)', { variant: 'success' });
    } catch (error) {
      console.error('Ошибка обновления фото:', error);
      enqueueSnackbar('Ошибка при редактировании фото.', { variant: 'warning' });
    }
  };

  const isFormInvalid =
    !editPhoto.link.trim() ||
    Boolean(linkError) ||
    !editPhoto.title.trim() ||
    Boolean(title) ||
    !editPhoto.description.trim() ||
    Boolean(description) || !editPhoto.photo

  const deletePhoto = () => {
    setEditPhoto({
      ...editPhoto,
      photo: null,
    });
  };

  useEffect(() => {
    document.title = "Редактирование фото карусели";
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: 2, md: 4 } }}>
      <NavLink to="/private/edit-carousel" style={{ textDecoration: 'none', color: theme.colors.primary, alignSelf: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowBackIcon sx={{ mr: 1 }} />
          Вернуться к карусели
        </Box>
      </NavLink>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 700,
          borderRadius: theme.spacing.exs,
          backgroundColor: theme.colors.white,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
          Редактировать фото
        </Typography>

        <form onSubmit={handlePhotoSubmit}>
          <TextField
            fullWidth
            label="Ссылка"
            name="link"
            value={editPhoto.link}
            onChange={inputChangeHandler}
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
            file={editPhoto.photo}
            error={isFormInvalid && !editPhoto.photo}
            helperText={isFormInvalid && !editPhoto.photo ? 'Фото обязательно для загрузки' : undefined}
          />

          <TextField
            fullWidth
            label="Заголовок"
            name="title"
            value={editPhoto.title}
            onChange={inputChangeHandler}
            error={Boolean(title)}
            helperText={title}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.xs,
            }}
          />

          <TextField
            fullWidth
            label="Описание"
            name="description"
            value={editPhoto.description}
            onChange={inputChangeHandler}
            multiline
            minRows={2}
            error={Boolean(description)}
            helperText={description}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />

          {editPhoto.photo && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: theme.spacing.sm }}>
              <img
                src={
                  editPhoto.photo instanceof File
                    ? URL.createObjectURL(editPhoto.photo)
                    : apiUrl + editPhoto.photo
                }
                alt="Превью фото"
                style={{
                  width: '200px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  marginBottom: '8px',
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

          <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <Button
              disabled={isFormInvalid}
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: isFormInvalid ? theme.colors.rgbaGrey : theme.colors.primary,
                color: theme.colors.white,
              }}
            >
              Сохранить
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default FormEditPhoto;
