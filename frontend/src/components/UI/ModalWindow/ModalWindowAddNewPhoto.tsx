import { DialogContent, Dialog, DialogTitle, Button, Alert } from '@mui/material';
import React, { useState } from 'react';
import { PhotoForm } from '../../../types';
import TextField from '@mui/material/TextField';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { addNewPhoto, fetchPhoto } from '../../../store/photoCarousel/photoCarouselThunk.ts';
import FileInput from '../FileInput/FileInput.tsx';
import { ToastContainer } from 'react-toastify';
import { selectPhotoError } from '../../../store/photoCarousel/photoCarouselSlice.ts';
import { enqueueSnackbar } from 'notistack';

interface Props {
  open: boolean;
  onClose: () => void;
}

const initialState = {
  link: "",
  photo: null,
};
const ModalWindowAddNewPhoto: React.FC<Props> = ({open, onClose}) => {
  const [newPhoto, setNewPhoto] = useState<PhotoForm>({...initialState});
  const dispatch = useAppDispatch()
  const errorPhoto = useAppSelector(selectPhotoError)

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addNewPhoto(newPhoto)).unwrap();
      enqueueSnackbar('Вы успешно добавили новое фото в карусель;)', { variant: 'success' });
      setNewPhoto({ ...initialState });
      onClose();
      await dispatch(fetchPhoto()).unwrap();
    } catch (e) {
      console.error("Error during form submission:", e);
    }
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewPhoto((prevState:PhotoForm) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, files } = e.target;

    if (files) {
      setNewPhoto((prevState: PhotoForm) => ({
        ...prevState,
        [name]: files[0] || null,
      }));
    }
  };
  return (
    <div>
      <Dialog open={open}>
        <DialogContent>
            <DialogTitle>Добавить новую фотографию</DialogTitle>
          <hr/>
          {errorPhoto && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {errorPhoto.message}
            </Alert>
          )}
          <form onSubmit={onFormSubmit} className="space-y-4" style={{ marginTop: '40px' }}>
            <div>
              <FileInput
                id="photo"
                name="photo"
                label="Фото для карусели"
                onGetFile={onFileChange}
                file={newPhoto.photo}
              />
            </div>
            <div>
              <TextField
                id="outlined-basic"
                label="Ccылка"
                name="link"
                variant="outlined"
                value={newPhoto.link}
                onChange={onInputChange}
                sx={{
                  mb: 3,
                  width: '95%',
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
            </div>
             <div style={{ marginTop: '20px' }}>
               <Button variant="contained" style={{backgroundColor:"#FDE910", color: "rgb(52, 51, 50)", borderRadius:"20px"}} type="submit">Добавить</Button>
               <Button style={{color: "red"}} onClick={onClose}>Отмена</Button>
             </div>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ModalWindowAddNewPhoto;