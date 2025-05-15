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
import theme from "../../../globalStyles/globalTheme.ts";

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
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: theme.colors.blurBackground,
          },
        }}
        PaperProps={{
          sx: {
            border: "1px solid #344C3D",
            borderRadius: "12px",
            boxShadow: "0px 8px 24px #344C3D",
            padding: "10px",
            width:"70%",
            height:"auto",
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

        <DialogTitle style={{ textAlign: "center", marginTop:theme.spacing.xs, marginBottom:theme.spacing.xs }}>Смена пароля</DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              alignSelf: 'flex-start',
              color: 'text.secondary',
              fontWeight: 400,
              mb: 0.5,
            }}
          >
            Пожалуйста, введите ваш нынешний пароль.
          </Typography>
          <TextField
            label="Нынешний пароль"
            variant="outlined"
            type={showCurrentPassword ? "text" : "password"}
            fullWidth
            value={currentPassword}
            onChange={handlePasswordChange}
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleCurrentPasswordVisibility}>
                    {showCurrentPassword ? <Visibility />  : <VisibilityOff /> }
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="body2"
            sx={{
              alignSelf: 'flex-start',
              color: 'text.secondary',
              fontWeight: 400,
              mb: 0.5,
              mt: theme.spacing.sm,
            }}
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
            sx={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.spacing.exs,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleNewPasswordVisibility}>
                    {showNewPassword ?  <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions
          style={{
            marginBottom: theme.spacing.sm,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            sx={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              mt: theme.spacing.sm,
              width:"30%",
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
