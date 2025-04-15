import { DialogContent, Dialog, DialogTitle, Button, Box } from '@mui/material';
import React, { useState } from 'react';
import { PhotoForm } from '../../../types';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from '../../../app/hooks.ts';
import { addNewPhoto, fetchPhoto } from '../../../store/photoCarousel/photoCarouselThunk.ts';
import FileInput from '../FileInput/FileInput.tsx';
import { ToastContainer } from 'react-toastify';
import { enqueueSnackbar } from 'notistack';
import { apiUrl } from '../../../globalConstants.ts';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  onClose: () => void;
}

const initialState = {
  link: "",
  photo: null,
};

const ModalWindowAddNewPhoto: React.FC<Props> = ({ open, onClose }) => {
  const [newPhoto, setNewPhoto] = useState<PhotoForm>({ ...initialState });
  const dispatch = useAppDispatch();
  const [linkError, setLinkError] = useState<string>("");

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
    const { name, value } = e.target;
    if (name === 'link' && value.trim() !== "") {
      setLinkError("");
    }

    setNewPhoto((prevState) => ({ ...prevState, [name]: value }));

    if (name === 'link' && value.trim() === "") {
      setLinkError("Поле для ссылки не может быть пустым");
    }
  };

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setNewPhoto((prevState: PhotoForm) => ({
        ...prevState,
        [name]: files[0],
      }));
    }
  };

  const resetForm = () => {
    setNewPhoto({ ...initialState });
    setLinkError("");
  }

  const deletePhoto = () => {
    setNewPhoto({
      ...newPhoto,
      photo: null,
    });
  };

  const isButtonFormInvalid = Boolean(linkError) || !newPhoto.photo;

  return (
    <div>
      <Dialog open={open}>
        <DialogContent>
          <DialogTitle sx={{
            "@media (max-width: 450px)": {
              fontSize: "16px",
            },
            "@media (max-width: 390px)": {
              fontSize: "14px",
            },
          }}>
            Добавить новую фотографию
          </DialogTitle>
          <hr />
          <form onSubmit={onFormSubmit} className="space-y-4" style={{ marginTop: '20px', fontSize: "10px" }}>
            <div>
              <TextField
                id="outlined-basic"
                label="Ссылка"
                name="link"
                variant="outlined"
                value={newPhoto.link}
                onChange={onInputChange}
                error={Boolean(linkError)}
                helperText={linkError}
                sx={{
                  marginBottom:"30px",
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
                    backgroundColor: "white",
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                }}
              />
            </div>
            <div>
              <FileInput
                id="photo"
                name="photo"
                label="Фото для карусели"
                onGetFile={onFileChange}
                file={newPhoto.photo}
              />
              {newPhoto.photo && (
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
                      newPhoto.photo instanceof File
                        ? URL.createObjectURL(newPhoto.photo)
                        : apiUrl + newPhoto.photo
                    }
                    alt="Фото для курсели"
                  />
                  <CloseIcon onClick={() => deletePhoto()}/>
                </Box>
              )}
            </div>
            <div style={{ marginTop: '20px' }}>
              <Button
                disabled={isButtonFormInvalid}
                variant="contained"
                style={{
                  backgroundColor: isButtonFormInvalid ? "lightgray" : "#FDE910",
                  color: "rgb(52, 51, 50)",
                  borderRadius: "20px",
                }}
                type="submit"
              >
                Добавить
              </Button>
              <Button
                style={{ color: "red", marginLeft: '10px' }}
                onClick={() => {
                   resetForm();
                    onClose();
              }}>
                Отмена
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ModalWindowAddNewPhoto;
