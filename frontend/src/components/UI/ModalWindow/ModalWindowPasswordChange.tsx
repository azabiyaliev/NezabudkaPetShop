import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { DialogActions } from "@mui/joy";
import React, { useState } from "react";
import { changePasswordAsync } from "../../../store/users/usersThunk.ts";
import { useAppDispatch } from "../../../app/hooks.ts";
import { enqueueSnackbar } from 'notistack';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalWindowPasswordChange: React.FC<Props> = ({ open, setOpen }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      enqueueSnackbar('Пожалуйста, заполните все поля.', { variant: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      enqueueSnackbar('Пароль должен быть не менее 6 символов.', { variant: 'error' });
      return;
    }

    const resultAction = await dispatch(changePasswordAsync({ currentPassword, newPassword }));

    if (changePasswordAsync.rejected.match(resultAction)) {
      const errorMessage = resultAction.payload?.message || 'Произошла ошибка при смене пароля.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      return;
    }

    enqueueSnackbar('Вы успешно изменили пароль;)', { variant: 'success' });
    setOpen(false);
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            border: "1px solid #344C3D",
            borderRadius: "12px",
            boxShadow: "0px 8px 24px #344C3D",
            padding: "10px",
          },
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "white",
            color: "red",
          }}
        >
          <CloseOutlinedIcon />
        </Button>

        <DialogTitle style={{ textAlign: "center", marginTop:"15px", marginBottom:"15px" }}>Смена пароля</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" align="center">
            Пожалуйста, введите ваш нынешний пароль.
          </Typography>
          <TextField
            label="Нынешний пароль"
            variant="outlined"
            type={showCurrentPassword ? "text" : "password"}
            fullWidth
            value={currentPassword}
            onChange={handlePasswordChange}
            style={{ marginTop: "10px", marginBottom: "20px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleCurrentPasswordVisibility}>
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            style={{ marginTop: "10px" }}
          >
            Введите новый пароль
          </Typography>
          <TextField
            label="Новый пароль"
            variant="outlined"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            value={newPassword}
            onChange={handleNewPasswordChange}
            style={{ marginTop: "10px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleNewPasswordVisibility}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions
          style={{
            marginBottom: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            sx={{
              marginTop: "20px",
              backgroundColor: "#FFEB3B",
              color: "black",
              width: "auto",
              maxWidth: "300px",
              borderRadius: "20px",
            }}
          >
            Сменить пароль
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalWindowPasswordChange;
