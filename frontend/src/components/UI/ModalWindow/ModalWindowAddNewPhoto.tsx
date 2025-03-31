import { DialogContent, Dialog, DialogTitle, Button } from "@mui/material";
import React, { useState } from 'react';
import { PhotoForm } from '../../../types';
import TextField from '@mui/material/TextField';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { addNewPhoto, fetchPhoto } from '../../../store/photoCarousel/photoCarouselThunk.ts';
import FileInput from '../FileInput/FileInput.tsx';
import { toast, ToastContainer } from 'react-toastify';
import { selectPhotoError } from '../../../store/photoCarousel/photoCarouselSlice.ts';

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
      toast.success("Вы успешно добавили новое фото в карусель;)");
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

  const getFieldError = (fieldName: string) => {
    if (!errorPhoto?.errors) return undefined;

    return (
      errorPhoto.errors[fieldName] ||
      errorPhoto.errors.general ||
      undefined
    );
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent>
            <DialogTitle>Добавить новую фотографию</DialogTitle>
          <hr/>
          <form onSubmit={onFormSubmit} className="space-y-4" style={{ marginTop: '40px' }}>
            <div>
              <FileInput
                id="photo"
                name="photo"
                label="Фото для карусели"
                onGetFile={onFileChange}
                file={newPhoto.photo}
                error={!!getFieldError("photo")}
                helperText={getFieldError("photo")}
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
                error={Boolean(getFieldError("link"))}
                helperText={getFieldError("link")}
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
                  "& .MuiOutlinedInput-root.Mui-error": {
                    backgroundColor: "#FFECEC",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FF0000",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-error": {
                    color: "#FF0000",
                  },
                  "& .MuiFormHelperText-root": {
                    minHeight: "20px",
                  },
                  "& .MuiFormHelperText-root.Mui-error": {
                    color: "#FF0000",
                    fontSize: "12px",
                    fontWeight: 500,
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