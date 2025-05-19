import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { NavLink, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { RegisterMutation } from "../../../types";
import { clearRegisterError, selectUserError } from "../../../store/users/usersSlice.ts";
import { register } from "../../../store/users/usersThunk.ts";
import "react-toastify/dist/ReactToastify.css";
import { regEmail, regPhone, reqPassword } from "../../../globalConstants.ts";
import { enqueueSnackbar } from "notistack";
import ReCAPTCHA from "react-google-recaptcha";
import { COLORS, FONTS, SPACING } from "../../../globalStyles/stylesObjects.ts";
import logo from "../../../assets/logo-nezabudka.webp";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import StayCurrentPortraitIcon from "@mui/icons-material/StayCurrentPortrait";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Tooltip } from "@mui/joy";
import theme from "../../../globalStyles/globalTheme.ts";
import './UserForm.css'

const initialState = {
  firstName: "",
  secondName: "",
  email: "",
  password: "",
  phone: "",
  recaptchaToken: "",
};
const RegisterUser = () => {
  const dispatch = useAppDispatch();
  const registerError = useAppSelector(selectUserError);
  const navigate = useNavigate();
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState<boolean>(false);
  const [form, setForm] = useState<RegisterMutation>(initialState);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

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
      if (value.trim() === "") {
        setEmailError("");
      } else {
        setEmailError(regEmail.test(value) ? "" : "Неправильный формат email");
      }
    }
    if (name === "password") {
      if (value.trim() === "") {
        setPasswordError("");
      } else {
        setPasswordError(
          reqPassword.test(value) ? "" : "Неправильный формат пароля",
        );
      }
    }
  };

  useEffect(() => {
    dispatch(clearRegisterError());
  }, [dispatch]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaToken) {
      enqueueSnackbar("Пожалуйста, подтвердите что вы не робот", {
        variant: "error",
      });
      return;
    }

    try {
      const response = await dispatch(
        register({
          ...form,
          recaptchaToken,
        }),
      ).unwrap();
      setForm({
        firstName: "",
        secondName: "",
        email: "",
        password: "",
        phone: "",
        recaptchaToken: "",
      });

      if (response && response.user.bonus > 0) {
        enqueueSnackbar(
          `Поздравляем! У вас есть ${response.user.bonus} бонусов!`,
          {
            variant: "success",
          },
        );
      }
      navigate("/");
    } catch (error) {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
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

  useEffect(() => {
    document.title = `Регистрация`;
  }, []);

  const hiddenPassword = () => {
    setPassword(!password);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        maxWidth: "1150px",
        margin: `${SPACING.main_spacing} auto 0`,
        "@media (max-width: 1380px)": {
          maxWidth: "1000px",
          padding: SPACING.sm
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
        textAlign="center"
        sx={{
          flexBasis: "40%",
          backgroundColor: COLORS.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.white,
          borderRadius: `${SPACING.sm} 0 0 ${SPACING.sm}`,
          "@media (max-width: 1380px)": {
            padding: SPACING.sm
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
          <Typography
            variant="h4"
            marginBottom={SPACING.xs}
          >
            Добро пожаловать
          </Typography>
          <Typography
          >
            У вас уже есть аккаунт? Нажмите здесь, чтобы войти.
          </Typography>
          <NavLink
            to="/login"
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
              Войти
            </Box>
          </NavLink>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: COLORS.BORDER_BACKGROUND,
          padding: 4,
          flexBasis: "60%",
          borderRadius: `0 ${SPACING.sm} ${SPACING.sm} 0`,
          "@media (max-width: 965px)": {
            borderRadius: "20px",
          },
        }}
      >
        <Avatar sx={{ m: 1, backgroundColor: COLORS.white }}>
          <LockOutlinedIcon sx={{ color: "black" }} />
        </Avatar>
        <Typography
          variant="h4"
          sx={{
            color: "black",
            "@media (max-width: 965px)": {
              fontSize: FONTS.size.xxl,
            },
            "@media (max-width: 550px)": {
              fontSize: FONTS.size.lg,
            },
          }}
        >
          Регистрация
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={submitHandler}
          sx={{
            width: "400px",
            mt: 3,
            "@media (max-width: 1075px)": {
              width: "300px",
            },
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
          <Grid container direction="column" spacing={2}>
            <Grid>
              <TextField
                fullWidth
                name="firstName"
                label="Ваше имя"
                value={form.firstName}
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
                  '& input:-webkit-autofill': {
                    boxShadow: '0 0 0 1000px white inset',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText
                error={Boolean(getFieldError("firstName"))}
                sx={{
                  marginLeft: "14px",
                }}
              >
                {getFieldError("firstName") || " "}
              </FormHelperText>
            </Grid>
            <Grid>
              <TextField
                fullWidth
                autoComplete="current-secondName"
                name="secondName"
                label="Ваша фамилия"
                value={form.secondName}
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
                  '& input:-webkit-autofill': {
                    boxShadow: '0 0 0 1000px white inset',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText
                error={Boolean(getFieldError("secondName"))}
                sx={{
                  marginLeft: SPACING.sm,
                }}
              >
                {getFieldError("secondName") || " "}
              </FormHelperText>
            </Grid>
            <Grid>
              <TextField
                fullWidth
                name="email"
                label="Email"
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
                  '& input:-webkit-autofill': {
                    boxShadow: '0 0 0 1000px white inset',
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
                error={Boolean(getFieldError("email") || emailError)}
                sx={{
                  marginLeft: SPACING.sm,
                }}
              >
                {getFieldError("email") || emailError || " "}
              </FormHelperText>
            </Grid>
            <Grid sx={{ position: "relative" }}>
              <TextField
                fullWidth
                autoComplete="current-password"
                name="password"
                label="Пароль"
                type={password ? "text" : "password"}
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
                error={Boolean(getFieldError("password") || passwordError)}
                sx={{
                  marginLeft: SPACING.sm,
                }}
              >
                {getFieldError("password") || passwordError || " "}
              </FormHelperText>
              {form.password && !reqPassword.test(form.password) && (
                <Tooltip title="">
                  <Typography
                    sx={{
                      fontSize: FONTS.size.sm,
                      color: theme.colors.black,
                      padding: SPACING.xs,
                      borderRadius: "7px",
                      width: "400px",
                      backgroundColor: theme.colors.second_warning,
                      position: "absolute",
                      top: "-100px",
                      zIndex: 1000,
                      right: "405px",
                      textAlign: "center",
                      "@media (max-width: 1075px)": {
                        right: "305px",
                      },
                      "@media (max-width: 965px)": {
                        top: "80px",
                        right: "0",
                      },
                      "@media (max-width: 750px)": {
                        width: "350px",
                      },
                      "@media (max-width: 550px)": {
                        top: "80px",
                        width: "280px",
                        fontSize: FONTS.size.xs,
                      },
                    }}
                  >
                    Пароль должен содержать <br />
                    Минимум 6 символов <br />
                    Наличие хотя бы одной строчной буквы.
                    <br />
                    Наличие хотя бы одной цифры.
                  </Typography>
                </Tooltip>
              )}
            </Grid>
            <Grid>
              <TextField
                fullWidth
                name="phone"
                label="Номер телефона"
                value={form.phone}
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
                  '& input:-webkit-autofill': {
                    boxShadow: '0 0 0 1000px white inset',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <StayCurrentPortraitIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText
                error={Boolean(getFieldError("phone") || phoneError)}
                sx={{
                  marginLeft: SPACING.sm,
                }}
              >
                {getFieldError("phone") || phoneError || " "}
              </FormHelperText>
            </Grid>
          </Grid>

            <Box sx={{ my: 2 }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                className="recaptcha"
                sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={(token) => {
                  setForm(prev => ({...prev, recaptchaToken: token || ''}));
                  setRecaptchaToken(token);
                }}
                onExpired={() => {
                  setForm(prev => ({...prev, recaptchaToken: ''}));
                  setRecaptchaToken(null);
                }}
              />
            </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mb: 2,
              mt: 4,
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              padding: SPACING.sm,
              "@media (max-width: 550px)": {
                padding: SPACING.xs,
                mt: 1,
              },
            }}
          >
            Зарегистрироваться
          </Button>
          <Typography
            sx={{
              display: "none",
              "@media (max-width: 965px)": {
                display: "block",
                textAlign: "center",
              },
              "@media (max-width: 550px)": {
                fontSize: FONTS.size.sm,
              },
            }}
          >
            У вас уже есть аккаунт? <br/>
            <NavLink
              to="/login"
              style={{
                textDecoration: "none",
                color: COLORS.primary,
                marginLeft: SPACING.sm,
              }}
            >
              Нажмите здесь, чтобы войти.
            </NavLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterUser;
