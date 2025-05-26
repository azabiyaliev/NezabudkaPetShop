import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { DialogActions } from "@mui/joy";
import React, { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useAppDispatch } from '../../../app/hooks.ts';
import { sendPasswordCode } from "../../../store/users/usersThunk.ts";
import { enqueueSnackbar } from 'notistack';
import { COLORS } from "../../../globalStyles/stylesObjects.ts";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalWindow: React.FC<Props> = ({ open, setOpen }) => {
  const [email, setEmail] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const dispatch = useAppDispatch();

  const handelCloseModal = () => {
    setOpen(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmitEmail = async () => {
    if (!email) {
      enqueueSnackbar('Пожалуйста, введите ваш email.', { variant: 'error' });
      return;
    }

    try {
      const response = await dispatch(sendPasswordCode(email));
      if (sendPasswordCode.fulfilled.match(response)) {
        setEmail("");
        setOpen(false);
        setShowSuccessDialog(true);
      } else {
        enqueueSnackbar('Такой почты не существует. Проверьте введенные данные.', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Ошибка при отправке сообщения на почту', { variant: 'error' });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handelCloseModal}
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
          onClick={handelCloseModal}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "white",
            color: "red",
            zIndex: 10,
            minWidth: "32px",
            height: "32px",
            padding: 0,
          }}
        >
          <CloseOutlinedIcon />
        </Button>
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: "24px",
            color: "#344C3D",
            "@media (max-width: 650px)": {
              fontSize: "20px",
            }
          }}
        >
          Восстановить пароль
        </DialogTitle>
        <hr />
        <DialogContent>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{
              mt: 1,
              fontSize: "16px",
              "@media (max-width: 650px)": {
                fontSize: "12px",
              }
            }}
          >
            Пожалуйста, введите ваш email, чтобы мы могли отправить вам сообщение для восстановления пароля.
          </Typography>
          <TextField
            label="Email"
            variant="standard"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            sx={{
              mt: 4,
              mb: 3,
              "& .MuiInputLabel-root": {
                color: "#738A6E",
              },
              "& .MuiInput-underline:before": {
                borderBottom: "2px solid #344C3D",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottom: "2px solid #344C3D",
              },
              "& .MuiInput-underline:after": {
                borderBottom: "2px solid #344C3D",
              },
            }}
            InputProps={{
              disableUnderline: false,
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleSubmitEmail}
            variant="contained"
            sx={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              width: "auto",
              maxWidth: "300px",
              borderRadius: "20px",
            }}
          >
            Отправить сообщение
          </Button>
        </DialogActions>
      </Dialog>

      {/* Успешный диалог */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        PaperProps={{
          sx: {
            border: "1px solid #344C3D",
            borderRadius: "12px",
            boxShadow: "0px 8px 24px #344C3D",
            padding: "10px",
            maxWidth: "90vw", // адаптивная ширина
            mx: "auto", // центрирование
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: "22px",
            color: "#344C3D",
            "@media (max-width: 600px)": {
              fontSize: "18px",
            },
          }}
        >
          Письмо отправлено
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 1,
              fontSize: "16px",
              color: "#4D4D4D",
              "@media (max-width: 600px)": {
                fontSize: "14px",
              },
            }}
          >
            Мы отправили письмо с инструкциями по восстановлению пароля.<br />
            Если вы не нашли его во <b>«Входящих»</b>, проверьте папку <b>«Спам»</b>.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setShowSuccessDialog(false)}
            sx={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              width: "auto",
              maxWidth: "300px",
              borderRadius: "20px",
              paddingX: 3,
              "@media (max-width: 600px)": {
                maxWidth: "90%",
                fontSize: "14px",
              },
            }}
          >
            Понятно
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default ModalWindow;
