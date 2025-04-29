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
import FileInput from '../../UI/FileInput/FileInput.tsx';
import { apiUrl } from '../../../globalConstants.ts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

interface FormEditPhotoProps {
  photoId: number;
}

const FormEditPhoto: React.FC<FormEditPhotoProps> = ({ photoId }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const photos = useAppSelector(selectPhotoCarousel);

  const [editPhoto, setEditPhoto] = useState<PhotoCarousel>({
    id: photoId,
    link: '',
    photo: null,
    order: 0,
    title: '',
    description: '',
  });

  const [linkError, setLinkError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');

  useEffect(() => {
    dispatch(fetchPhoto()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    const photoToEdit = photos.find(p => p.id === photoId);
    if (photoToEdit) setEditPhoto(photoToEdit);
  }, [photos, photoId]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'link') {
      setLinkError(value.trim() === '' ? 'Поле для ссылки не может быть пустым' : '');
    }
    if (name === 'title') {
      setTitleError(value.trim() === '' ? 'Поле для заголовка не может быть пустым' : '');
    }
    if (name === 'description') {
      setDescError(value.trim() === '' ? 'Поле для описания не может быть пустым' : '');
    }

    setEditPhoto(prev => ({ ...prev, [name]: value }));
  };

  const onFileChange = (file: File) => {
    setEditPhoto(prev => ({ ...prev, photo: file }));
  };

  const deletePhoto = () => {
    setEditPhoto(prev => ({ ...prev, photo: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updatePhoto({ photo: editPhoto })).unwrap();
      console.log('Отправка фото:', editPhoto.photo);
      enqueueSnackbar('Вы отредактировали фото для карусели;)', { variant: 'success' });
      navigate('/edit-carousel');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Ошибка при обновлении фото.', { variant: 'error' });
    }
  };

  const isFormInvalid =
    !editPhoto.link.trim() ||
    !editPhoto.photo ||
    Boolean(linkError) ||
    Boolean(titleError) ||
    Boolean(descError);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: 2, md: 4 } }}>
      <NavLink to="/edit-carousel" style={{ textDecoration: 'none', color: '#738A6E', alignSelf: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
          Редактировать фото
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            size="small"
            label="Ссылка"
            name="link"
            value={editPhoto.link}
            onChange={inputChangeHandler}
            error={Boolean(linkError)}
            helperText={linkError}
            sx={{ mb: 2 }}
          />

          <FileInput
            id="photo"
            name="photo"
            label="Фото"
            onGetFile={onFileChange}
            file={editPhoto.photo}
            error={!editPhoto.photo}
            helperText={!editPhoto.photo ? 'Фото обязательно для загрузки' : undefined}
          />

          <TextField
            fullWidth
            size="small"
            label="Заголовок"
            name="title"
            value={editPhoto.title}
            onChange={inputChangeHandler}
            error={Boolean(titleError)}
            helperText={titleError}
            sx={{ mt: 2, mb: 2 }}
          />

          <TextField
            fullWidth
            size="small"
            label="Описание"
            name="description"
            value={editPhoto.description}
            onChange={inputChangeHandler}
            multiline
            minRows={2}
            error={Boolean(descError)}
            helperText={descError}
            sx={{ mb: 2 }}
          />

          {editPhoto.photo && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
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

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              disabled={isFormInvalid}
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: isFormInvalid ? 'lightgray' : '#FDE910',
                color: 'rgb(52, 51, 50)',
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: isFormInvalid ? 'lightgray' : '#e0d809',
                }
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
