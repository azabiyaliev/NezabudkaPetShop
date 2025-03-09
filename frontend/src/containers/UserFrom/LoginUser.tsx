import React, { useState } from "react";
import { Avatar, Box, Button, Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from '../../app/hooks.ts';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogInMutation } from "../../types";
import { login } from "../../features/users/usersThunk.ts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const LoginUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<LogInMutation>({
    email: "",
    password: "",
  });

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
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
            <Grid container justifyContent="flex-end">
              <Grid>
                <NavLink to="/register" style={{ color: "black" }}>
                  У вас нету аккаунта? Зарегистрироваться
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

export default LoginUser;
