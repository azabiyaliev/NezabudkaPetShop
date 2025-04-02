import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { NavLink, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { RegisterMutation } from "../../../types";
import { selectUserError } from "../../../store/users/usersSlice.ts";
import { register } from "../../../store/users/usersThunk.ts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { regEmail, regPhone } from '../../../globalConstants.ts';



const initialState = {
  firstName: "",
  secondName: "",
  email: "",
  password: "",
  phone: "",
};
const RegisterUser = () => {
  const dispatch = useAppDispatch();
  const registerError = useAppSelector(selectUserError);
  const navigate = useNavigate();

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [form, setForm] = useState<RegisterMutation>(initialState);

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

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      setForm(initialState);
      toast.success("Регистрация успешна!", { position: "top-right" });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const getFieldError = (fieldName: string) => {
    if (!registerError?.errors) return undefined;

    if (registerError.errors[fieldName]) return registerError.errors[fieldName];

    if (registerError.errors.general) {
      const generalError = registerError.errors.general.toLowerCase();

      if (
        (fieldName !== "email" && generalError.includes("email")) ||
        (fieldName !== "phone" && generalError.includes("номер"))
      ) {
        return undefined;
      }

      return registerError.errors.general;
    }

    return undefined;
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
            border: "2px solid #FFEB3B",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "white" }}>
            <LockOutlinedIcon sx={{ color: "black" }} />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: "black" }}>
            Регистрация
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={submitHandler}
            sx={{ mt: 3 }}
          >
            <Grid container direction="column" spacing={2}>
              <Grid>
                <TextField
                  fullWidth
                  autoComplete="current-firstName"
                  name="firstName"
                  label="Ваше имя"
                  value={form.firstName}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("firstName"))}
                  helperText={getFieldError("firstName")}
                  sx={{ backgroundColor: "white", borderRadius: "7px" }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  autoComplete="current-secondName"
                  name="secondName"
                  label="Ваша фамилия"
                  value={form.secondName}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("secondName"))}
                  helperText={getFieldError("secondName")}
                  sx={{ backgroundColor: "white", borderRadius: "7px" }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("email")) || Boolean(emailError)}
                  helperText={getFieldError("email") || emailError}
                  sx={{ backgroundColor: "white", borderRadius: "7px" }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  autoComplete="current-password"
                  name="password"
                  label="Придумайте пароль"
                  type="password"
                  value={form.password}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("password"))}
                  helperText={getFieldError("password")}
                  sx={{ backgroundColor: "white", borderRadius: "7px" }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  name="phone"
                  label="Номер телефона"
                  value={form.phone}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("phone")) || Boolean(phoneError)}
                  helperText={getFieldError("phone") || phoneError}
                  sx={{ backgroundColor: "white", borderRadius: "7px" }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#FFEB3B", color: "black" }}
            >
              Зарегистрироваться
            </Button>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid>
                <NavLink to="/login" style={{ color: "black" }}>
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
