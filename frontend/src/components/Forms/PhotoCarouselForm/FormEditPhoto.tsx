import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { updatePhoto } from '../../../store/photoCarousel/photoCarouselThunk.ts';
import FileInput from '../../UI/FileInput/FileInput.tsx';
import { PhotoCarousel, PhotoForm } from '../../../types';
import { toast } from 'react-toastify';
import { selectPhotoCarousel } from '../../../store/photoCarousel/photoCarouselSlice.ts';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface FormEditPhotoProps {
  photoId: number;
}

const FormEditPhoto: React.FC<FormEditPhotoProps> = ({ photoId }) => {
  const photos = useAppSelector(selectPhotoCarousel);
  const photoToEdit = photos.find((p) => p.id === photoId);
  const navigate = useNavigate();

  const [editPhoto, setEditPhoto] = useState<PhotoCarousel>({
    id: photoId,
    link: '',
    photo: null,
    order: 0,
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (photoToEdit) {
      setEditPhoto(photoToEdit);
    }
  }, [photoToEdit]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditPhoto((prevState) => ({ ...prevState, [name]: value }));
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
    } catch (error) {
      console.error('Ошибка обновления фото:', error);
      toast.error('Ошибка при обновлении фото.');
    }
  };

  return (
   <div style={{marginTop:"50px"}}>
     <Box sx={{ padding: 4,
       backgroundColor: '#fff',
       borderRadius: 2,
       boxShadow: 3,
       width: '40%',
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center',
       flexDirection: 'column',
       margin: 'auto', }}>
       <Typography component="h1" variant="h4" sx={{ color: 'black', textAlign: 'center', marginBottom: 3 }}>
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
             sx={{ width: '70%', marginBottom: 2 }}
           />

           <div style={{ marginBottom: '16px' }}>
             <FileInput
               id="photo"
               name="photo"
               label="Фото для карусели"
               onGetFile={onFileChange}
               file={editPhoto.photo}
             />
           </div>
         </Box>
         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
           <Button
             type="submit"
             variant="contained"
             color="primary"
             sx={{
               backgroundColor: "#738A6E",
               color: 'white',
               fontSize: '16px',
               padding: '10px 20px',
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
