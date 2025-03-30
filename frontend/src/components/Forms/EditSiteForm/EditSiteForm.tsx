import { Box, Button, Container, Typography, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { EditSiteMutation } from "../../../types";
import { fetchSite, updateSite } from "../../../store/editionSite/editionSiteThunk.ts";
import { selectEditSite, selectError } from "../../../store/editionSite/editionSiteSlice.ts";

const initialState: EditSiteMutation = {
  instagram: "",
  whatsapp: "",
  schedule: "",
  address: "",
  email: "",
  phone: "",
};

const EditSiteForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<EditSiteMutation>(initialState);
  const site = useAppSelector(selectEditSite);
  const editError = useAppSelector(selectError);

  useEffect(() => {
    dispatch(fetchSite())
      .unwrap()
      .then((siteEdit) => {
        if (siteEdit) {
          setForm(siteEdit);
        }
      })
      .catch(() => toast.error("Ошибка загрузки данных сайта"));
  }, [dispatch]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const getFieldError = (fieldName: string) => editError?.errors?.[fieldName] || "";

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!site?.id) {
      toast.error("Ваш id неверный!");
      return;
    }

    try {
      await dispatch(updateSite({ id: site.id, data: form })).unwrap();
      toast.success("Вы успешно отредактировали сайт!");
      navigate(`/`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCarouselChange = () => {
    navigate("/edit-carousel");
  };

  return (
    <Container component="main">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", padding: 4 }}>
        <Typography component="h1" variant="h5" sx={{ color: "black" }}>
          Редактировать сайт
        </Typography>
        <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 3 }} width="100%">
          <TextField fullWidth name="instagram" label="Instagram" value={form.instagram} onChange={inputChangeHandler} error={!!getFieldError("instagram")} helperText={getFieldError("instagram")} variant="outlined" sx={{ mb: 3 }} />
          <TextField fullWidth name="whatsapp" label="WhatsApp" value={form.whatsapp} onChange={inputChangeHandler} error={!!getFieldError("whatsapp")} helperText={getFieldError("whatsapp")} variant="outlined" sx={{ mb: 3 }} />
          <TextField fullWidth name="schedule" label="График работы" value={form.schedule} onChange={inputChangeHandler} error={!!getFieldError("schedule")} helperText={getFieldError("schedule")} variant="outlined" sx={{ mb: 3 }} />
          <TextField fullWidth name="address" label="Адрес" value={form.address} onChange={inputChangeHandler} error={!!getFieldError("address")} helperText={getFieldError("address")} variant="outlined" sx={{ mb: 3 }} />
          <TextField fullWidth name="email" label="Email" type="email" value={form.email} onChange={inputChangeHandler} error={!!getFieldError("email")} helperText={getFieldError("email")} variant="outlined" sx={{ mb: 3 }} />
          <TextField fullWidth name="phone" label="Телефон" type="tel" value={form.phone} onChange={inputChangeHandler} error={!!getFieldError("phone")} helperText={getFieldError("phone")} variant="outlined" sx={{ mb: 3 }} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: "#FFEB3B", color: "black", width:"30%" }}>
            Сохранить изменения
          </Button>
        </Box>
      </Box>
      <Button style={{backgroundColor: "#738A6E", color: "white"}} onClick={handleCarouselChange}>Редактировать карусель</Button>
      <ToastContainer />
    </Container>
  );
};

export default EditSiteForm;