import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { DialogActions } from "@mui/joy";
import React, { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useAppDispatch } from '../../../app/hooks.ts';
import { sendPasswordCode } from "../../../store/users/usersThunk.ts";
import { enqueueSnackbar } from 'notistack';


interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalWindow: React.FC<Props> = ({ open, setOpen }) => {
  const [email, setEmail] = useState("");
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
        enqueueSnackbar('Проверьте почту, вам поступило сообщение для восстановления пароля!', { variant: 'success' });
        setEmail("");
        setOpen(false);
      } else {
        enqueueSnackbar('Такой почты не существует. Проверьте введенные данные.', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Ошибка при отправке сообщения на почту', { variant: 'error' });
    }
  };

  return (
    <div>
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
              backgroundColor: "#FFEB3B",
              color: "black",
              width: "auto",
              maxWidth: "300px",
              borderRadius: "20px",
            }}
          >
            Отправить сообщение
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalWindow;
