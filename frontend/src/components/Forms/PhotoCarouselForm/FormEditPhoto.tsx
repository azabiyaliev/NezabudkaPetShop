import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchPhoto, updatePhoto } from '../../../store/photoCarousel/photoCarouselThunk.ts';
import { PhotoCarousel, PhotoForm } from '../../../types';
import { toast } from 'react-toastify';
import { selectPhotoCarousel, selectPhotoError } from '../../../store/photoCarousel/photoCarouselSlice.ts';
import { Alert, Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileInput from '../../UI/FileInput/FileInput.tsx';
import { enqueueSnackbar } from 'notistack';

interface FormEditPhotoProps {
  photoId: number;
}

const FormEditPhoto: React.FC<FormEditPhotoProps> = ({ photoId }) => {
  const photos = useAppSelector(selectPhotoCarousel);
  const navigate = useNavigate();
  const errorPhoto = useAppSelector(selectPhotoError)


  const [editPhoto, setEditPhoto] = useState<PhotoCarousel>({
    id: photoId,
    link: '',
    photo: null,
    order: 0,
  });

  const dispatch = useAppDispatch();

  console.log(editPhoto)
  useEffect(() => {
    dispatch(fetchPhoto())
      .unwrap()
  }, [dispatch]);

  useEffect(() => {
    const photoToEdit = photos.find((p) => p.id === photoId);
    if (photoToEdit) {
      setEditPhoto(photoToEdit);
    }
  }, [photos, photoId]);

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
      enqueueSnackbar('Вы отредатировали фото для карусели;)', { variant: 'success' });
    } catch (error) {
      console.error('Ошибка обновления фото:', error);
      toast.error('Ошибка при обновлении фото.');
    }
  };

  return (
   <div style={{marginTop:"50px"}}>
     <div style={{ marginTop: '50px', marginLeft:"60px" }}>
       <NavLink to="/edit-carousel" style={{ color:"#738A6E", textDecoration:"none" }}><span><ArrowBackIcon sx={{width:"20px", marginRight:"10px"}}/>Вернуться к карусели</span></NavLink>
     </div>
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

       {errorPhoto && (
         <Alert severity="error" sx={{ width: "100%" }}>
           {errorPhoto.message}
         </Alert>
       )}

       <form onSubmit={handlePhotoSubmit} style={{ width: '100%' }}>
         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3, flexDirection: 'column', alignItems: 'center' }}>
           <TextField
             id="outlined-basic"
             label="Ссылка"
             name="link"
             variant="outlined"
             value={editPhoto.link}
             onChange={inputChangeHandler}
             sx={{
               mb: 3,
               width: '71%',
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
             }}
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
               backgroundColor: "#FDE910",
               color: "rgb(52, 51, 50)",
               fontSize: '16px',
               padding: '10px 20px',
               borderRadius: '20px',
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
