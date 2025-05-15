import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { DialogActions } from "@mui/joy";
import React, { useState } from "react";
import { changePasswordAsync } from "../../../store/users/usersThunk.ts";
import { useAppDispatch } from "../../../app/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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

  const handleClose = () => setOpen(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      enqueueSnackbar("Пожалуйста, заполните все поля.", { variant: "error" });
      return;
    }

    if (newPassword.length < 6) {
      enqueueSnackbar("Пароль должен быть не менее 6 символов.", {
        variant: "error",
      });
      return;
    }

    const resultAction = await dispatch(
      changePasswordAsync({ currentPassword, newPassword })
    );

    if (changePasswordAsync.rejected.match(resultAction)) {
      const errorMessage =
        resultAction.payload?.message ||
        "Произошла ошибка при смене пароля.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      return;
    }

    enqueueSnackbar("Вы успешно изменили пароль ;)", { variant: "success" });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: theme.colors.blurBackground,
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "16px",
          width: { xs: "90%", sm: "70%", md: "500px" },
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <IconButton
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
      </IconButton>

      <DialogTitle
        sx={{
          textAlign: "center",
          marginTop: theme.spacing.xs,
          marginBottom: theme.spacing.xs,
        }}
      >
        Смена пароля
      </DialogTitle>

      <DialogContent
        sx={{
          overflowY: "auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Пожалуйста, введите ваш нынешний пароль.
        </Typography>
        <TextField
          label="Нынешний пароль"
          variant="outlined"
          type={showCurrentPassword ? "text" : "password"}
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.spacing.exs,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowCurrentPassword((prev) => !prev)}>
                  {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Введите новый пароль
        </Typography>
        <TextField
          label="Новый пароль"
          variant="outlined"
          type={showNewPassword ? "text" : "password"}
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.spacing.exs,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNewPassword((prev) => !prev)}>
                  {showNewPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          marginTop: 2,
          marginBottom: theme.spacing.sm,
        }}
      >
        <Button
          onClick={handlePasswordSubmit}
          variant="contained"
          sx={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.white,
            width: { xs: "100%", sm: "50%", md: "30%" },
          }}
        >
          Сменить пароль
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalWindowPasswordChange;
