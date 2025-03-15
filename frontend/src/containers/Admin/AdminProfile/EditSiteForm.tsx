import { Box, Button, Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { toast, ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { EditSiteMutation } from '../../../types';
import { fetchSite, updateSite } from '../../../features/editionSite/editionSiteThunk.ts';
import { selectEditSite, selectError } from '../../../features/editionSite/editionSiteSlice.ts';
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

const EditSiteForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<EditSiteMutation>(initialState);
  const site = useAppSelector(selectEditSite);
  const editError = useAppSelector(selectError);

  useEffect(() => {
    dispatch(fetchSite()).unwrap().then((siteEdit) => setForm({
      instagram: siteEdit.instagram || "",
      whatsapp: siteEdit.whatsapp || "",
      schedule: siteEdit.schedule || "",
      address: siteEdit.address || "",
      email: siteEdit.email || "",
      phone: siteEdit.phone || "",
      logo:  null,
    }));
  }, [dispatch])

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, files } = e.target;

    if (files) {
      setForm((prevState: EditSiteMutation) => ({
        ...prevState,
        [name]: files[0] || null,
      }));
    }
  };

  const getFieldError = (fieldName: string) => {
    if (!editError?.errors) return undefined;
    return editError.errors[fieldName] || editError.errors.general || undefined;
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!site?.id) {
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
      await dispatch(updateSite({id: site.id, data: form})).unwrap();
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
      console.log(error);
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
                  error={Boolean(getFieldError("instagram"))}
                  helperText={getFieldError("instagram")}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                    mb: 3
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
                  error={Boolean(getFieldError("whatsapp"))}
                  helperText={getFieldError("whatsapp")}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-4">
                <TextField
                  fullWidth
                  name="schedule"
                  label="График работы"
                  type="text"
                  id="schedule"
                  value={form.schedule}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("schedule"))}
                  helperText={getFieldError("schedule")}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                    mt:3
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-4">
                <TextField
                  fullWidth
                  name="address"
                  label="Адрес магазина"
                  type="text"
                  id="address"
                  value={form.address}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("address"))}
                  helperText={getFieldError("address")}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-4">
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("email"))}
                  helperText={getFieldError("email")}
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "7px",
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-4">
                <TextField
                  fullWidth
                  name="phone"
                  label="Номер телефона магазина"
                  type="phone"
                  id="text"
                  value={form.phone}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("phone"))}
                  helperText={getFieldError("phone")}
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

export default EditSiteForm;