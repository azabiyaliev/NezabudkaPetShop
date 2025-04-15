import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchPhoto, updatePhoto } from '../../../store/photoCarousel/photoCarouselThunk.ts';
import { PhotoCarousel, PhotoForm } from '../../../types';
import { selectPhotoCarousel } from '../../../store/photoCarousel/photoCarouselSlice.ts';
import { Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileInput from '../../UI/FileInput/FileInput.tsx';
import { enqueueSnackbar } from 'notistack';
import { apiUrl } from '../../../globalConstants.ts';
import CloseIcon from '@mui/icons-material/Close';

interface FormEditPhotoProps {
  photoId: number;
}

const FormEditPhoto: React.FC<FormEditPhotoProps> = ({ photoId }) => {
  const photos = useAppSelector(selectPhotoCarousel);
  const navigate = useNavigate();
  const [linkError, setLinkError] = useState("");

  const [editPhoto, setEditPhoto] = useState<PhotoCarousel>({
    id: photoId,
    link: '',
    photo: null,
    order: 0,
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
  };

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, files } = e.target;

    if (files) {
      setEditPhoto((prevState: PhotoForm) => ({
        ...prevState,
        [name]: files[0] || null,
      }));
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(updatePhoto({ photo: editPhoto })).unwrap();
      navigate('/edit-carousel');
      enqueueSnackbar('Вы отредатировали фото для карусели;)', { variant: 'success' });
    } catch (error) {
      console.error('Ошибка обновления фото:', error);
      enqueueSnackbar('Ошибка при обновлении фото.', { variant: 'warning' });
    }
  };

  const isButtonFormInvalid =
    !editPhoto.link.trim() || Boolean(linkError) || !editPhoto.photo;

  const deletePhoto = () => {
    setEditPhoto({
      ...editPhoto,
      photo: null,
    });
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <Box sx={{
        marginTop: '50px',
        marginLeft: "60px",
        "@media (max-width: 800px)": {
          padding: 2,
          marginLeft: "0px",
        },
      }}>
        <NavLink to="/edit-carousel" style={{ color: "#738A6E", textDecoration: "none" }}>
          <span>
            <ArrowBackIcon sx={{ width: "20px", marginRight: "10px" }} />Вернуться к карусели
          </span>
        </NavLink>
      </Box>
      <Box
        sx={{
          padding: 4,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          margin: 'auto',
          "@media (max-width: 600px)": {
            padding: 2,
            width: '90%',
          },
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ color: 'black',
            textAlign: 'center',
            marginBottom: 3,
            "@media (max-width: 4500px)": {
              fontSize: '20px',
            }
          }}>
          Редактировать фото
        </Typography>

        <form onSubmit={handlePhotoSubmit} style={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3, flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              id="outlined-basic"
              label="Ссылка"
              name="link"
              variant="outlined"
              value={editPhoto.link}
              onChange={inputChangeHandler}
              error={Boolean(linkError)}
              helperText={linkError}
              sx={{
                mb: 3,
                width: '60%',
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "white",
                  transition: "all 0.3s ease",
                  height: "56px",
                  "&.Mui-focused": {
                    borderColor: "green",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "green",
                    transition: "border-color 0.3s ease",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "darkgreen",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "green",
                },
                "@media (max-width: 600px)": {
                  width: '90%',
                  padding: '10px',
                },
                "@media (max-width: 430px)": {
                  padding: '5px',
                  width: '100%',
                },
              }}
            />

            <div style={{ marginBottom: '16px' }}>
              <FileInput
                id="photo"
                name="photo"
                label="Фото для карусели"
                onGetFile={onFileChange}
                file={editPhoto.photo}
                error={!editPhoto.photo}
                helperText={!editPhoto.photo ? "Фото обязательно для загрузки" : ""}
              />
            </div>
            {editPhoto.photo && (
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
                    editPhoto.photo instanceof File
                      ? URL.createObjectURL(editPhoto.photo)
                      : apiUrl + editPhoto.photo
                  }
                  alt="Фото для курсели"
                />
                <CloseIcon onClick={() => deletePhoto()}/>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isButtonFormInvalid}
              sx={{
                backgroundColor: "#FDE910",
                color: "rgb(52, 51, 50)",
                fontSize: '16px',
                padding: '10px 20px',
                borderRadius: '20px',
                "@media (max-width: 600px)": {
                  fontSize: '14px',
                  padding: '8px 15px',
                },
              }}
            >
              Сохранить
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default FormEditPhoto;
