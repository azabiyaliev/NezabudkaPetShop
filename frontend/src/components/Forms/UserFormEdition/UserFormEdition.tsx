import { Avatar, Box, Button, Container } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import React, { useEffect, useState } from "react";
import { AdminRefactor } from "../../../types";
import { fetchUserById, updateUser } from "../../../store/users/usersThunk.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import ModalWindowPasswordChange from "../../UI/ModalWindow/ModalWindowPasswordChange.tsx";
import LockResetIcon from "@mui/icons-material/LockReset";

const initialState = {
  firstName: "",
  secondName: "",
  email: "",
};

const UserFormEdition = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<AdminRefactor>(initialState);
  const user = useAppSelector(selectUser);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error(
        "Для редактирования данных пользователя необходимо войти в систему.",
      );
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
          }),
        );
    }
  }, [dispatch, user, navigate, id]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error("Ваш id неверный!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      await dispatch(updateUser({ id: parseInt(id), data: form })).unwrap();
      await dispatch(fetchUserById(id)).unwrap;

      toast.success("Вы успешно отредактировали профиль!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      if (user && user.role === "admin") {
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

  return (
    <div>
      <Container component="main" maxWidth="lg" sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "white" }}>
            <PersonIcon sx={{ color: "black" }} />
          </Avatar>

          {user && user.role === "admin" && (
            <Typography component="h1" variant="h5" sx={{ color: "black" }}>
              Редактировать профиль
            </Typography>
          )}

          {user && user.role === "client" && (
            <Typography component="h1" variant="h5" sx={{ color: "black" }}>
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
                    backgroundColor: "white",
                    borderRadius: "7px",
                    mb: 5,
                  }}
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
                    backgroundColor: "white",
                    borderRadius: "7px",
                  }}
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
                    backgroundColor: "white",
                    borderRadius: "7px",
                  }}
                />
              </div>
            </div>

            {user && user.role === "admin" && (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#FFEB3B",
                  color: "black",
                }}
              >
                Cохранить изменения
              </Button>
            )}

            {user && user.role === "client" && (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#FFEB3B",
                  color: "black",
                }}
              >
                Изменить данные
              </Button>
            )}
          </Box>

          <Button
            type="button"
            variant="contained"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "rgb(255, 247, 204)",
              color: "black",
              marginTop: "20px",
              marginRight: "40px",
            }}
            onClick={handlePasswordChangeOpen}
          >
            <LockResetIcon style={{ paddingRight: "8px" }} />
            Сменить пароль
          </Button>
        </Box>
      </Container>

      <ModalWindowPasswordChange open={open} setOpen={setOpen} />
      <ToastContainer />
    </div>
  );
};

export default UserFormEdition;
