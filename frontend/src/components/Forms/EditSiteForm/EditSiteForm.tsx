import { Box, Button, Container, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { EditSiteMutation } from '../../../types';
import { fetchSite, updateSite } from '../../../store/editionSite/editionSiteThunk.ts';
import { selectEditSite, selectError } from '../../../store/editionSite/editionSiteSlice.ts';
import { enqueueSnackbar } from 'notistack';
import theme from '../../../globalStyles/globalTheme.ts';
import { Typography } from '@mui/material';

const initialState: EditSiteMutation = {
  instagram: "",
  whatsapp: "",
  schedule: "",
  address: "",
  email: "",
  phone: "",
  linkAddress: "",
  mapGoogleLink: "",
};

const regPhone = /^\+\(996\)\d{3}-\d{3}-\d{3}$/;
export const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;

const EditSiteForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<EditSiteMutation>(initialState);
  const site = useAppSelector(selectEditSite);
  const editError = useAppSelector(selectError);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [instaError, setInstaError] = useState("");
  const [whatsError, setWhatsError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [linkAddressError, setLinkAddressError] = useState("");
  const [mapGoogleLinkError, setMapGoogleLinkError] = useState("");

  useEffect(() => {
    dispatch(fetchSite())
      .unwrap()
      .then((siteEdit) => {
        if (siteEdit) {
          setForm(siteEdit);
        }
      });
  }, [dispatch]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "mapGoogleLink") {
      // Автоматически заменяем /edit? на /embed? для корректной ссылки
      newValue = value.replace("/edit?", "/embed?");
    }

    setForm((prevState) => ({ ...prevState, [name]: newValue }));

    // Валидация полей
    if (name === "phone") {
      if (newValue.trim() === "") {
        setPhoneError("");
      } else {
        setPhoneError(
          regPhone.test(newValue)
            ? ""
            : "Неправильный формат телефона. Ожидается: +(996)500-111-222"
        );
      }
    }
    if (name === "email") {
      setEmailError(regEmail.test(newValue) ? "" : "Неправильный формат email");
    }

    if (name === "instagram") setInstaError(newValue.trim() === "" ? "Поле для ссылки Instagram не может быть пустым" : "");
    if (name === "whatsapp") setWhatsError(newValue.trim() === "" ? "Поле для ссылки WhatsApp не может быть пустым" : "");
    if (name === "schedule") setScheduleError(newValue.trim() === "" ? "Поле для графика работы не может быть пустым" : "");
    if (name === "address") setAddressError(newValue.trim() === "" ? "Поле для адреса магазина не может быть пустым" : "");
    if (name === "linkAddress") setLinkAddressError(newValue.trim() === "" ? "Поле для ссылки на адрес магазина не может быть пустым" : "");
    if (name === "mapGoogleLink") setMapGoogleLinkError(newValue.trim() === "" ? "Поле для ссылки Google Map не может быть пустым" : "");
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!site?.id) {
      toast.error("Ваш id неверный!");
      return;
    }

    if (
      phoneError ||
      emailError ||
      instaError ||
      whatsError ||
      scheduleError ||
      addressError ||
      linkAddressError ||
      mapGoogleLinkError
    ) {
      toast.error("Пожалуйста, исправьте ошибки в форме перед отправкой.");
      return;
    }

    try {
      await dispatch(updateSite({ id: site.id, data: form })).unwrap();
      enqueueSnackbar("Вы успешно отредактировали сайт!", { variant: "success" });
      navigate(`/private/edition_site`);
      await dispatch(fetchSite());
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при обновлении данных сайта.");
    }
  };

  const getFieldError = (fieldName: string) => editError?.errors?.[fieldName] || "";

  const isButtonFormInvalid =
    Object.values(form).some(
      (value) => typeof value === "string" && value.trim() === ""
    ) ||
    Boolean(phoneError) ||
    Boolean(emailError) ||
    Boolean(instaError) ||
    Boolean(whatsError) ||
    Boolean(scheduleError) ||
    Boolean(addressError) ||
    Boolean(linkAddressError) ||
    Boolean(mapGoogleLinkError);

  useEffect(() => {
    document.title = "Редактирование информации о магазине 'Незабудка'";
  }, []);

  return (
    <Container component="main">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography
          gutterBottom
          sx={{
            textAlign: "center",
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.medium,
            "@media (max-width: 900px)": {
              mt: 5,
            },
          }}
        >
          Редактирование информации о магазине 'Незабудка'
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={submitHandler}
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          width="70%"
        >
          <TextField
            fullWidth
            name="instagram"
            label="Ссылка на Instagram"
            value={form.instagram}
            onChange={inputChangeHandler}
            variant="outlined"
            error={!!getFieldError("instagram") || Boolean(instaError)}
            helperText={getFieldError("instagram") || instaError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
            }}
          />
          <TextField
            fullWidth
            name="whatsapp"
            label="Ссылка на WhatsApp"
            value={form.whatsapp}
            onChange={inputChangeHandler}
            variant="outlined"
            error={!!getFieldError("whatsapp") || Boolean(whatsError)}
            helperText={getFieldError("whatsapp") || whatsError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />
          <TextField
            fullWidth
            name="schedule"
            label="График работы"
            value={form.schedule}
            onChange={inputChangeHandler}
            variant="outlined"
            error={!!getFieldError("schedule") || Boolean(scheduleError)}
            helperText={getFieldError("schedule") || scheduleError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />
          <TextField
            fullWidth
            name="address"
            label="Адрес"
            value={form.address}
            onChange={inputChangeHandler}
            variant="outlined"
            error={!!getFieldError("address") || Boolean(addressError)}
            helperText={getFieldError("address") || addressError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />
          <TextField
            fullWidth
            name="linkAddress"
            label="Ссылка на местоположение на карте 2GIS"
            value={form.linkAddress}
            onChange={inputChangeHandler}
            variant="outlined"
            error={!!getFieldError("linkAddress") || Boolean(linkAddressError)}
            helperText={getFieldError("linkAddress") || linkAddressError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />
          <TextField
            fullWidth
            name="mapGoogleLink"
            label="Ссылка на местоположение магазина в Google Map"
            value={form.mapGoogleLink}
            onChange={inputChangeHandler}
            variant="outlined"
            error={!!getFieldError("linkAddress") || Boolean(linkAddressError)}
            helperText={getFieldError("linkAddress") || linkAddressError }
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />

          <Box
            sx={{
              mt: 1,
              p: 1,
              bgcolor: theme.colors.rgbaGrey,
              border: `1px dashed ${theme.colors.DARK_GRAY}`,
              borderRadius: 1,
              alignSelf: "flex-start",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              Как вставить карту Google:
            </Typography>
            <Typography variant="caption" component="div" color="text.secondary">
              1. Откройте <b>Google My Maps</b> и создайте карту.<br />
              2. Нажмите <b>"Поделиться"</b>.<br />
              3. Скопируйте ссылку<br />
              4. Вставьте её в поле выше.
            </Typography>
          </Box>

          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={inputChangeHandler}
            variant="outlined"
            error={!!getFieldError("email") || Boolean(emailError)}
            helperText={getFieldError("email") || emailError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />
          <TextField
            fullWidth
            name="phone"
            label="Телефон"
            type="phone"
            value={form.phone}
            onChange={inputChangeHandler}
            variant="outlined"
            error={!!getFieldError("phone") || Boolean(phoneError)}
            helperText={getFieldError("phone") || phoneError}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
              mt: theme.spacing.sm,
            }}
          />

          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isButtonFormInvalid}
              sx={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.white,
                mt: theme.spacing.sm,
              }}
            >
              Сохранить изменения
            </Button>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default EditSiteForm;
