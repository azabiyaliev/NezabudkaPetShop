import { Avatar, Box, Button, Container } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import React, { useEffect, useState } from 'react';
import { AdminRefactor } from '../../../types';
import { fetchUserById, updateUser } from '../../../features/users/usersThunk.ts';
import { selectUser } from '../../../features/users/usersSlice.ts';
 const initialState ={
   firstName: "",
   secondName: "",
   email: "",
 }

const AdminForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<AdminRefactor>(initialState);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if(!user){
      toast.error("Для редактирования данных пользователя необходимо войти в систему.");
      navigate('/login');
    }
    if(id){
      dispatch(fetchUserById(id)).unwrap().then((user) => setForm({
        firstName: user.firstName || "",
        secondName: user.secondName || "",
        email: user.email || "",
      }));
    }
  }, [dispatch, user, navigate, id])

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
      await dispatch(updateUser({id: parseInt(id), data: form})).unwrap();
      setForm({ ...initialState });
      toast.success("Вы успешно отредактировали профиль!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate(`/users/${id}`);
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
      <Container component="main" maxWidth='lg'>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "white" }}>
            <PersonIcon sx={{ color: "black" }} />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: "black" }}>
            Редактировать профиль
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={submitHandler}
            sx={{ mt: 3 }}
            width='100%'
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
                    mb: 5
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
              Cохранить изменения
            </Button>
          </Box>
        </Box>
      </Container>

      <ToastContainer />
    </div>
  );
};

export default AdminForm;
