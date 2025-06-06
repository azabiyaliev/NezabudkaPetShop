import { Avatar, Box, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import React, { useEffect, useState } from "react";
import { AdminRefactor } from "../../../types";
import { fetchUserById, updateUser } from "../../../store/users/usersThunk.ts";
import { errorUpdate, selectUser } from '../../../store/users/usersSlice.ts';
import ModalWindowPasswordChange from "../../UI/ModalWindow/ModalWindowPasswordChange.tsx";
import LockResetIcon from "@mui/icons-material/LockReset";
import { regPhone, userRoleAdmin, userRoleClient, userRoleSuperAdmin } from '../../../globalConstants.ts';
import { regEmail } from '../EditSiteForm/EditSiteForm.tsx';
import { enqueueSnackbar } from 'notistack';
import theme from "../../../globalStyles/globalTheme.ts";

const initialState = {
  firstName: "",
  secondName: "",
  email: "",
  phone:"",
};

const UserFormEdition = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<AdminRefactor>(initialState);
  const user = useAppSelector(selectUser);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [secondName, setSecondName] = useState("");
  const errorEdit = useAppSelector(errorUpdate)
  const can = usePermission(user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (id) {
      dispatch(fetchUserById(id))
        .unwrap()
        .then((user) =>
          setForm({
            firstName: user.firstName || "",
            secondName: user.secondName || "",
            email: user.email || "",
            phone: user.phone || "",
          }),
        );
    }
  }, [dispatch, user, navigate, id]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));

    if (name === "phone") {
      if (value.trim() === "") {
        setPhone("");
      } else {
        setPhone(
          regPhone.test(value) ? "" : "Неправильный формат телефона",
        );
      }
    }

    if (name === "email") {
      setEmail(regEmail.test(value) ? "" : "Неправильный формат email");
    }

    if (name === "firstName") setName("");
    if (name === "secondName") setSecondName("");

    if (name === "firstName" && value.trim() === "") {
      setName("Поле имени не может быть пустым");
    }
    if (name === "secondName" && value.trim() === "") {
      setSecondName("Поле для фамилии не может быть пустым");
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      enqueueSnackbar('Вaш ID неверный', { variant: 'error' });
      return;
    }

    try {
      await dispatch(updateUser({ id: parseInt(id), data: form })).unwrap();
      await dispatch(fetchUserById(id)).unwrap;
      enqueueSnackbar('Вы успешно отредактировали профиль!', { variant: 'success' });

      if (user && can([userRoleAdmin, userRoleSuperAdmin])) {
        navigate(`/private/users/${user.id}`);
      } else {
        navigate(`/client/users/${user && user.id}`);
      }
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

  const handlePasswordChangeOpen = () => {
    setOpen(true);
  };

  const getFieldError = (fieldName: string) => errorEdit?.errors?.[fieldName] || "";

  const isButtonFormInvalid =
    Object.values(form).some(value => typeof value === "string" && value.trim() === "") ||
    Boolean(phone) ||
    Boolean(email) ||
    Boolean(name) ||
    Boolean(secondName)

  useEffect(() => {
    document.title = "Мои данные";
  }, []);

  return (
    <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative"
          }}
        >
          <Avatar sx={{ bgcolor: theme.colors.white }}>
            <PersonIcon sx={{ color: theme.colors.black }} />
          </Avatar>

          {user && can([userRoleAdmin, userRoleSuperAdmin]) && (
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: theme.fonts.weight.medium }}>
              Редактировать профиль
            </Typography>
          )}

          {user && can([userRoleClient]) && (
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight:  theme.fonts.weight.medium }}>
              Мои данные
            </Typography>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={submitHandler}
            sx={{ mt: 3 }}
            width="100%"
          >
            <div className="row">
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="firstName"
                  label="Имя"
                  type="text"
                  id="firstName"
                  value={form.firstName}
                  onChange={inputChangeHandler}
                  variant="outlined"
                  sx={{
                    backgroundColor: theme.colors.white,
                    borderRadius: theme.spacing.exs,
                    mt: theme.spacing.sm,
                  }}
                  error={!!getFieldError("firstName") || Boolean(name)}
                  helperText={getFieldError("firstName") || name}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  fullWidth
                  name="secondName"
                  label="Фамилия"
                  type="text"
                  id="secondName"
                  value={form.secondName}
                  onChange={inputChangeHandler}
                  variant="outlined"
                  sx={{
                    backgroundColor: theme.colors.white,
                    borderRadius: theme.spacing.exs,
                    mt: theme.spacing.sm,
                  }}
                  error={!!getFieldError("secondName") || Boolean(secondName)}
                  helperText={getFieldError("secondName") || secondName}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={inputChangeHandler}
                  variant="outlined"
                  sx={{
                    backgroundColor: theme.colors.white,
                    borderRadius: theme.spacing.exs,
                    mt: theme.spacing.sm,
                  }}
                  error={!!getFieldError("email") || Boolean(email)}
                  helperText={getFieldError("email") || email}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <TextField
                  fullWidth
                  name="phone"
                  label="Номер телефона"
                  type="phone"
                  id="phone"
                  value={form.phone}
                  onChange={inputChangeHandler}
                  variant="outlined"
                  sx={{
                    backgroundColor: theme.colors.white,
                    borderRadius: theme.spacing.exs,
                    mt: theme.spacing.sm,
                  }}
                  error={!!getFieldError("phone") || Boolean(phone)}
                  helperText={getFieldError("phone") || phone}
                />
              </div>
            </div>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                mt: 5,
                alignItems: 'center',
                justifyContent: 'space-between',
                '@media (max-width: 500px)': {
                  flexDirection: 'column',
                  alignItems: 'stretch',
                },
              }}
            >
              {user && can([userRoleAdmin, userRoleSuperAdmin]) && (
                <Button
                  type="submit"
                  disabled={isButtonFormInvalid}
                  variant="contained"
                  sx={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.white,
                    '@media (max-width: 500px)': {
                      mb: 2
                    },
                  }}
                >
                  Cохранить изменения
                </Button>
              )}

              {user && can([userRoleClient]) && (
                <Button
                  type="submit"
                  disabled={isButtonFormInvalid}
                  variant="contained"
                  sx={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.white,
                    '@media (max-width: 500px)': {
                      mb: 2
                    },
                  }}
                >
                  Изменить данные
                </Button>
              )}
              <Button
                type="button"
                variant="contained"
                sx={{
                  backgroundColor:
                    user?.role === "admin" || user?.role === "superAdmin"
                      ? theme.colors.adminBackgroundYellow
                      :  theme.colors.OLIVE_GREEN,
                  color: theme.colors.white,
                }}
                onClick={handlePasswordChangeOpen}
              >
                <LockResetIcon style={{ paddingRight: "8px" }} />
                Сменить пароль
              </Button>
          </Box>
          </Box>
        </Box>
      <ModalWindowPasswordChange open={open} setOpen={setOpen} />
      <ToastContainer />
    </>
  );
};

export default UserFormEdition;
