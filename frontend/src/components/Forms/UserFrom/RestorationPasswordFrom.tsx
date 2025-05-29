import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { verifyResetCode } from '../../../store/users/usersThunk.ts';
import { Box, Button, Container, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';

const RestorationPasswordFrom = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      enqueueSnackbar('Неверная ссылка для сброса пароля.', { variant: 'error' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      enqueueSnackbar('Пароли не совпадают.', { variant: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      enqueueSnackbar('Пароль должен быть не менее 6 символов.', { variant: 'error' });
      return;
    }

    const payload = {
      resetToken: token,
      newPassword: newPassword,
    };

    const result = await dispatch(verifyResetCode(payload));

    if (result.payload && 'message' in result.payload) {
      enqueueSnackbar(result.payload.message, { variant: 'success' } );
      navigate('/login');
    } else if (result.payload && 'errors' in result.payload) {
      enqueueSnackbar('Ошибка при сбросе пароля.', { variant: 'error' });
    }else {
      enqueueSnackbar('Срок действия ссылки истёк или произошла ошибка.', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "white",
          border: "2px solid #8EA58C",
          boxShadow: "0px 8px 24px #8EA58C",
          mt: 8,
          mb: 8,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: "20px",
            textAlign: "center",
            mb:5,
            "@media (max-width: 650px)": {
              fontSize: "24px",
            }
        }}>
          Сброс пароля
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Новый пароль"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={handlePasswordChange}
            required
            sx={{ marginBottom: "20px", mb:3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Подтвердите пароль"
            variant="outlined"
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={handleConfirmPasswordChange}
            required
            sx={{ marginBottom: "20px", mb:5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(prev => !prev)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#FFEB3B",
                color: "black",
                padding: "10px",
                width: "auto",
                maxWidth: "500px",
                borderRadius: "20px",
                mb:2,
                "&:hover": {
                  backgroundColor: "#F3DA0B",
                },
              }}
            >
              Сбросить пароль
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default RestorationPasswordFrom;
