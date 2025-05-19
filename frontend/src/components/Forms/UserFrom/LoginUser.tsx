import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Divider, FormHelperText, IconButton, InputAdornment } from "@mui/material";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogInMutation } from '../../../types';
import { facebookLogin, googleLogin, login, } from '../../../store/users/usersThunk.ts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FacebookLogin from '@greatsumini/react-facebook-login';
import FacebookIcon from '@mui/icons-material/Facebook';
import { selectLoginError } from '../../../store/users/usersSlice.ts';
import ModalWindow from '../../UI/ModalWindow/ModalWindowEmail.tsx';
import { regEmail, userRoleAdmin, userRoleSuperAdmin } from '../../../globalConstants.ts';
import { COLORS, FONTS, SPACING } from "../../../globalStyles/stylesObjects.ts";
import logo from "../../../assets/logo-nezabudka.webp";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MailIcon from "@mui/icons-material/Mail";
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import { clearLoginError } from '../../../store/users/usersSlice.ts';
import { enqueueSnackbar } from "notistack";


const LoginUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const registerError = useAppSelector(selectLoginError);
  const [password, setPassword] = useState<boolean>(false);
  const [form, setForm] = useState<LogInMutation>({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    dispatch(clearLoginError());
  }, [dispatch]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));

    if (name === "email") {
      if (value.trim() === "") {
        setEmailError("");
      } else {
        setEmailError(regEmail.test(value) ? "" : "Неправильный формат email");
      }
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const hiddenPassword = () => {
    setPassword(!password);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedInUser = await dispatch(login(form)).unwrap();
      if (
        loggedInUser.user.role === userRoleAdmin
      ) {
        navigate("/private_account");
      } else if ( loggedInUser.user.role === userRoleSuperAdmin ){
        navigate("/private/order_stats");
      } else {
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message || "Произошла ошибка. Повторите попытку.";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });

    }
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate("/");
  };

  const startGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (tokenResponse.access_token) {
        void googleLoginHandler(tokenResponse.access_token);
      }
    },
    onError: () => alert("Google Login failed!"),
  });
;

  const facebookLoginHandler = async (accessToken: string) => {
    await dispatch(facebookLogin({ accessToken })).unwrap();
    navigate("/");
  };

  const getFieldError = (fieldName: string) => {
    if (!registerError?.errors) return undefined;

    return (
      registerError.errors[fieldName] ||
      registerError.errors.general ||
      undefined
    );
  };

  useEffect(() => {
    document.title = `Вход в аккаунт`;
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        maxWidth: "1150px",
        margin: `${SPACING.main_spacing} auto 0`,
        "@media (max-width: 1380px)": {
          maxWidth: "1000px",
          padding: SPACING.sm,
        },
        "@media (max-width: 965px)": {
          flexDirection: "column",
          maxWidth: "700px",
        },
        "@media (max-width: 750px)": {
          maxWidth: "500px",
        },
        "@media (max-width: 550px)": {
          maxWidth: "450px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: COLORS.BORDER_BACKGROUND,
          padding: 4,
          flexBasis: "60%",
          borderRadius: "20px 0 0 20px",
          "@media (max-width: 965px)": {
            borderRadius: SPACING.sm,
          },
        }}
      >
        <Avatar
          sx={{
            m: 1,
            backgroundColor: COLORS.white,
          }}
        >
          <LockOpenIcon sx={{ color: "black" }} />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ color: "black" }}>
          Вход в аккаунт
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={submitHandler}
          sx={{
            width: "450px",
            mt: 3,
            "@media (max-width: 965px)": {
              width: "400px",
            },
            "@media (max-width: 750px)": {
              width: "350px",
            },
            "@media (max-width: 550px)": {
              width: "280px",
            },
          }}
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
                sx={{
                  backgroundColor: COLORS.white,
                  borderRadius: "7px",
                  "& fieldset": {
                    border: "none",
                  },
                  "& label.Mui-focused": {
                    color: COLORS.primary,
                  },
                  "& input:-webkit-autofill": {
                    boxShadow: "0 0 0 1000px white inset",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText
                error={Boolean(getFieldError("email") || Boolean(emailError))}
                sx={{
                  marginLeft: SPACING.sm,
                  paddingBottom: SPACING.xs,
                }}
              >
                {getFieldError("email") || emailError || " "}
              </FormHelperText>
            </Grid>
            <Grid>
              <TextField
                fullWidth
                name="password"
                label="Введите пароль"
                type={password ? "text" : "password"}
                id="password"
                value={form.password}
                onChange={inputChangeHandler}
                sx={{
                  backgroundColor: COLORS.white,
                  borderRadius: "7px",
                  position: "relative",
                  "& fieldset": {
                    border: "none",
                  },
                  "& label.Mui-focused": {
                    color: COLORS.primary,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => hiddenPassword()}
                        edge="end"
                        sx={{ mr: "-6px" }}
                        aria-label="toggle password visibility"
                      >
                        {password ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText
                error={Boolean(getFieldError("password"))}
                sx={{
                  marginLeft: SPACING.sm,
                }}
              >
                {getFieldError("password") || " "}
              </FormHelperText>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              margin: `${SPACING.xs} 0`,
              backgroundColor: COLORS.primary,
              color: COLORS.white,
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
                Забыли пароль?
              </Typography>
              <Button
                variant="text"
                style={{ color: COLORS.black }}
                onClick={handleClickOpen}
              >
                Восстановить пароль
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ width: "100%", textAlign: "center", mt: SPACING.sm }}>
          <Divider sx={{ mb: SPACING.sm, textTransform: "uppercase" }}>
            или войти с
          </Divider>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            "@media (max-width: 750px)": {
              flexDirection: "column",
              gap: SPACING.sm,
            },
          }}
        >
          <Grid size={8}>
            <FacebookLogin
              appId="1011210890854768"
              onSuccess={(response) =>
                facebookLoginHandler(response.accessToken)
              }
              onFail={() => alert("Facebook Login failed!")}
              render={({ onClick }) => (
                <Button
                  onClick={onClick}
                  startIcon={<FacebookIcon />}
                  variant="contained"
                  sx={{
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                    fontSize: FONTS.size.default,
                    fontWeight: FONTS.weight.bold,
                    padding: SPACING.xs,
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: COLORS.BORDER_BACKGROUND,
                      color: COLORS.black,
                    },
                    width: "200px",
                    "@media (max-width: 750px)": {
                      width: "350px",
                      padding: SPACING.exs,
                    },
                    "@media (max-width: 550px)": {
                      width: "280px",
                    },
                  }}
                >
                  Facebook
                </Button>
              )}
            />
          </Grid>
          <Grid size={8}>
            <Button
              onClick={() => startGoogleLogin()}
              startIcon={<GoogleIcon />}
              variant="contained"
              sx={{
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                fontSize: FONTS.size.default,
                fontWeight: FONTS.weight.bold,
                padding: SPACING.xs,
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: COLORS.BORDER_BACKGROUND,
                  color: COLORS.black,
                },
                width: "200px",
                "@media (max-width: 750px)": {
                  width: "350px",
                  padding: SPACING.exs,
                },
                "@media (max-width: 550px)": {
                  width: "280px",
                },
              }}
            >
              Google
            </Button>
          </Grid>
        </Box>
      </Box>

      <ModalWindow open={open} setOpen={setOpen} />
      <ToastContainer />
      <Box
        textAlign="center"
        sx={{
          flexBasis: "40%",
          backgroundColor: COLORS.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.white,
          borderRadius: `0 ${SPACING.sm} ${SPACING.sm} 0`,
          "@media (max-width: 1380px)": {
            padding: SPACING.sm,
          },
          "@media (max-width: 965px)": {
            display: "none",
          },
        }}
      >
        <Box>
          <Box
            component="img"
            src={logo}
            alt="Nezabudka"
            sx={{
              height: "180px",
              width: "180px",
              marginBottom: SPACING.sm,
              marginRight: "8px",
            }}
          />
          <Typography variant="h4" marginBottom="10px">
            Добро пожаловать
          </Typography>
          <Typography>У вас нет аккаунта?</Typography>
          <NavLink
            to="/register"
            style={{
              color: COLORS.white,
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                padding: SPACING.xs,
                border: "1px solid white",
                display: "block",
                maxWidth: "250px",
                backgroundColor: COLORS.white,
                color: COLORS.primary,
                margin: `${SPACING.sm} auto`,
                borderRadius: SPACING.xs,
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              Зарегестрироваться
            </Box>
          </NavLink>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginUser;
