import { Box, Button, Container, Typography, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { useNavigate } from 'react-router-dom';
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
  linkAddress: ""
};

const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;
export const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;

const EditSiteForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<EditSiteMutation>(initialState);
  const site = useAppSelector(selectEditSite);
  const editError = useAppSelector(selectError);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");


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

    if (name === "phone") {
      if (value.trim() === "") {
        setPhoneError("");
      } else {
        setPhoneError(
          regPhone.test(value) ? "" : "Неправильный формат телефона",
        );
      }
    }
    if (name === "email") {
      setEmailError(regEmail.test(value) ? "" : "Неправильный формат email");
    }
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
      await dispatch(fetchSite())
    } catch (error) {
      console.error(error);
    }
  };

  const handleCarouselChange = () => {
    navigate("/edit-carousel");
  };

  return (
    <Container component="main">
      <Box sx={{ marginTop: 3, display: "flex", flexDirection: "column", alignItems: "center", padding: 4, position: "relative" }}>
        <Typography component="h1" variant="h4" sx={{ color: "black", marginBottom: 3 }}>
          Редактировать сайт
        </Typography>
        <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center", }} width="70%">
          <TextField
            fullWidth
            name="instagram"
            label="Ссылка на Instagram"
            value={form.instagram}
            onChange={inputChangeHandler}
            error={!!getFieldError("instagram")}
            helperText={getFieldError("instagram")}
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#E4E6D9",
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
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          />
          <TextField
            fullWidth
            name="whatsapp"
            label="Ссылка на WhatsApp"
            value={form.whatsapp}
            onChange={inputChangeHandler}
            error={!!getFieldError("whatsapp")}
            helperText={getFieldError("whatsapp")}
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#E4E6D9",
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
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          />
          <TextField
            fullWidth
            name="schedule"
            label="График работы"
            value={form.schedule}
            onChange={inputChangeHandler}
            error={!!getFieldError("schedule")}
            helperText={getFieldError("schedule")}
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#E4E6D9",
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
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          />
          <TextField
            fullWidth
            name="address"
            label="Адрес"
            value={form.address}
            onChange={inputChangeHandler}
            error={!!getFieldError("address")}
            helperText={getFieldError("address")}
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#E4E6D9",
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
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          />
          <TextField
            fullWidth
            name="linkAddress"
            label="Ссылка на местоположение на карте"
            value={form.linkAddress}
            onChange={inputChangeHandler}
            error={!!getFieldError("linkAddress")}
            helperText={getFieldError("linkAddress")}
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#E4E6D9",
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
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={inputChangeHandler}
            error={!!getFieldError("email") || Boolean(emailError)}
            helperText={getFieldError("email")|| emailError}
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#E4E6D9",
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
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          />
          <TextField
            fullWidth
            name="phone"
            label="Телефон"
            type="phone"
            value={form.phone}
            onChange={inputChangeHandler}
            error={!!getFieldError("phone") || Boolean(phoneError)}
            helperText={getFieldError("phone") || phoneError}
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#E4E6D9",
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
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          />

          <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#FFEB3B",
                color: "black",
                width: "40%",
                borderRadius: "20px"
              }}
            >
              Сохранить изменения
            </Button>
          </Box>
        </Box>
        <Button variant="contained" style={{backgroundColor: "#738A6E",width: "27%", color: "white",  borderRadius:"20px", position:'absolute', bottom:47 , right:165}} onClick={handleCarouselChange}>Редактировать карусель</Button>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default EditSiteForm;