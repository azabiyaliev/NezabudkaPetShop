import { Avatar, Box, Button, Container } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { toast, ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { SiteMutation } from '../../../types';
import { fetchSiteById, updateSite } from '../../../features/editionSite/editionSiteThunk.ts';
import { selectEditSite } from '../../../features/editionSite/editionSiteSlice.ts';
import FileInput from '../../../components/UI/FileInput.tsx';

const initialState = {
  instagram: "",
  whatsapp: "",
  schedule: "",
  address: "",
  email: "",
  phone: "",
  logo: null
}

const EditSiteFrom = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<SiteMutation>(initialState);
  const site = useAppSelector(selectEditSite)

  useEffect(() => {
    if(id){
      dispatch(fetchSiteById(id)).unwrap().then((siteEdit) => setForm({
        instagram: siteEdit.instagram || "",
        whatsapp: siteEdit.whatsapp || "",
        schedule: siteEdit.schedule || "",
        address: siteEdit.address || "",
        email: siteEdit.email || "",
        phone: siteEdit.phone || "",
        logo:  null,
      }));
    }
  }, [dispatch, navigate, id])

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, files } = e.target;

    if (files) {
      setForm((prevState: SiteMutation) => ({
        ...prevState,
        [name]: files[0] || null,
      }));
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error("Ваш id неверный!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      await dispatch(updateSite({id: parseInt(id), data: form})).unwrap();
      setForm({ ...initialState });
      toast.success("Вы успешно отредактировали сайт!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate(`/`);
    } catch (error) {
      toast.error((error as { error: string }).error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div>
      <Container component="main">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "white" }}>
            <PersonIcon sx={{ color: "black" }} />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: "black" }}>
            Редактировать сайт
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={submitHandler}
            sx={{ mt: 3 }}
            width='100%'
          >
            <div className="row">
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="instagram"
                  label="Instagram"
                  type="text"
                  id="instagram"
                  value={form.instagram}
                  onChange={inputChangeHandler}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                    mb: 5
                  }}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="whatsapp"
                  label="What`s App"
                  type="text"
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={inputChangeHandler}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <TextField
                  fullWidth
                  name="schedule"
                  label="График работы"
                  type="text"
                  id="schedule"
                  value={form.schedule}
                  onChange={inputChangeHandler}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                  }}
                />
              </div>
            </div>

              <div className="row">
                <div className="col-12">
                  <TextField
                    fullWidth
                    name="address"
                    label="Адрес магазина"
                    type="text"
                    id="address"
                    value={form.address}
                    onChange={inputChangeHandler}
                    variant="outlined"
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "7px",
                    }}
                  />
                </div>
            </div>

            <div className="row">
              <div className="col-12">
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={inputChangeHandler}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <TextField
                  fullWidth
                  name="phone"
                  label="Номер телефона магазина"
                  type="phone"
                  id="text"
                  value={form.phone}
                  onChange={inputChangeHandler}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <FileInput
                  id="logo"
                  name="logo"
                  label="Фотографии на главной странице в карусели"
                  onGetFile={onFileChange}
                  file={form.logo}
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#FFEB3B",
                color: "black",
              }}
            >
              Cохранить изменения
            </Button>
          </Box>
        </Box>
      </Container>

      <ToastContainer />
    </div>
  );
};

export default EditSiteFrom;