import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogInMutation } from "../../types";
import { facebookLogin, googleLogin, login } from '../../features/users/usersThunk.ts';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import FacebookIcon from "@mui/icons-material/Facebook";
import { selectLoginError } from '../../features/users/usersSlice.ts';
import { regEmail } from './RegisterUser.tsx';
import ModalWindow from '../../components/ModalWindow/ModalWindowEmail.tsx';

const LoginUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const registerError = useAppSelector(selectLoginError);

  const [form, setForm] = useState<LogInMutation>({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");


  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));

    if (name === "email") {
      setEmailError(regEmail.test(value) ? "" : "Неправильный формат email");
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      navigate('/')
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

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate("/");
  };

  const facebookLoginHandler = async (accessToken: string) => {
    await dispatch(facebookLogin({accessToken})).unwrap();
    navigate('/');
  };

  const getFieldError = (fieldName: string) => {
    if (!registerError?.errors) return undefined;

    return registerError.errors[fieldName] || registerError.errors.general || undefined;
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
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            border: "2px solid  #FFEB3B",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "white" }}>
            <LockOpenIcon sx={{ color: "black" }} />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: "black" }}>
            Вход в аккаунт
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={submitHandler}
            sx={{ mt: 3 }}
          >
            <Grid direction={"column"} spacing={2}>
              <Grid>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("email")) || Boolean(emailError)}
                  helperText={getFieldError("email") || emailError}
                  style={{
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
                  label="Введите пароль"
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError("password"))}
                  helperText={getFieldError("password")}
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
              Войти
            </Button>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid>
                <Typography variant="body2" color="textSecondary" align="center">
                  У вас нет аккаунта?
                </Typography>
                <NavLink to="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="text" style={{ color: 'black' }}>
                    Зарегистрироваться
                  </Button>
                </NavLink>
              </Grid>

              <Grid>
                <Typography variant="body2" color="textSecondary" align="center">
                  Забыли пароль?
                </Typography>
                <Button variant="text" style={{ color: 'black' }} onClick={handleClickOpen}>
                  Восстановить пароль
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
            <Divider sx={{ mb: 2, textTransform: "uppercase" }}>или войти с</Divider>
          </Box>
          <Grid container direction={'column'} size={12} spacing={2} mt={2}>
            <Grid size={12}>
              <FacebookLogin
                appId="1011210890854768"
                onSuccess={response => facebookLoginHandler(response.accessToken)}
                onFail={() => alert('Facebook Login failed!')}
                render={({ onClick }) => (
                  <Button
                    onClick={onClick}
                    startIcon={<FacebookIcon />}
                    variant="contained"
                    sx={{
                      backgroundColor: "#1877f2",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "bold",
                      padding: "10px",
                      borderRadius: "8px",
                      "&:hover": { backgroundColor: "#145db2" },
                      width: "100%",
                    }}
                  >
                    Facebook
                  </Button>
                )}
              />
            </Grid>
            <Grid size={12}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    void googleLoginHandler(credentialResponse.credential);
                  }
                }}
                onError={() => alert("Login failed")}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>

      <ModalWindow open={open} setOpen={setOpen} />
      <ToastContainer />
    </div>
  );
};

export default LoginUser;
