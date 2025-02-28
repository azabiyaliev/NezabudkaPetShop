import React, { useState } from "react";
import { Avatar, Box, Button, Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { NavLink } from "react-router-dom";
import { RegisterMutation } from "../../types";
import { selectUserError } from "../../features/users/usersSlice.ts";
import { register } from "../../features/users/usersThunk.ts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;
const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;

const RegisterUser = () => {
  const dispatch = useAppDispatch();
  const registerError = useAppSelector(selectUserError);
  const [phoneError, setPhoneError] = useState<{ phone?: string }>({});
  const [emailError, setEmailError] = useState<{ email?: string }>({});

  const [form, setForm] = useState<RegisterMutation>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));

    if (name === "phone") {
      if (regPhone.test(value)) {
        setPhoneError((prevState) => ({ ...prevState, phone: "" }));
      } else {
        setPhoneError((prevState) => ({
          ...prevState,
          phone: "Неправильный формат номера телефона",
        }));
      }
    }

    if (name === "email") {
      if (regEmail.test(value)) {
        setEmailError((prevState) => ({ ...prevState, email: "" }));
      } else {
        setEmailError((prevState) => ({
          ...prevState,
          email: "Неправильный формат email",
        }));
      }
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      toast.success("Регистрация успешна!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      if (registerError) {
        // Показываем ошибку через Toast
        if (registerError.errors?.email) {
          toast.error(registerError.errors.email.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (registerError.errors?.password) {
          toast.error(registerError.errors.password.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (registerError.errors?.phone) {
          toast.error(registerError.errors.phone.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    }
  };

  const getFielderror = (fieldName: string) => {
    return registerError?.errors[fieldName]?.message;
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            padding: 4,
            borderRadius: 2,
            border: "2px solid  #FFEB3B",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "white" }}>
            <LockOutlinedIcon sx={{ color: "black" }} />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: "black" }}>
            Регистрация
          </Typography>
          <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 3 }}>
            <Grid direction={"column"} spacing={2}>
              <Grid>
                <TextField
                  fullWidth
                  name="firstName"
                  label="Ваше имя"
                  type="firstName"
                  id="firstName"
                  value={form.firstName}
                  onChange={inputChangeHandler}
                  error={Boolean(getFielderror("firstName"))}
                  helperText={getFielderror("firstName")}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "white",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Ваша фамилия"
                  type="lastName"
                  id="lastName"
                  value={form.lastName}
                  onChange={inputChangeHandler}
                  error={Boolean(getFielderror("lastName"))}
                  helperText={getFielderror("lastName")}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "white",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={inputChangeHandler}
                  error={Boolean(getFielderror("email")) || Boolean(emailError.email)}
                  helperText={getFielderror("email") || emailError.email}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "white",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  name="password"
                  label="Придумайте пароль"
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={inputChangeHandler}
                  error={Boolean(getFielderror("password"))}
                  helperText={getFielderror("password")}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "white",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  name="phone"
                  label="Номер телефона"
                  type="phone"
                  id="phone"
                  value={form.phone}
                  onChange={inputChangeHandler}
                  error={Boolean(getFielderror("phone")) || Boolean(phoneError.phone)}
                  helperText={getFielderror("phone") || phoneError.phone}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "white",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                />
              </Grid>
            </Grid>

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
              Зарегистрироваться
            </Button>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid>
                <NavLink
                  to="/login"
                  style={{
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  У вас уже есть аккаунт? Войти
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>


      <ToastContainer />
    </div>
  );
};

export default RegisterUser;
