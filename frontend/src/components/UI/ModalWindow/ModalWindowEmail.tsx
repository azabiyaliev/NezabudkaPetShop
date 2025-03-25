import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DialogActions } from '@mui/joy';
import React, { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useAppDispatch } from '../../../app/hooks.ts';
import { sendPasswordCode, verifyResetCode } from '../../../store/users/usersThunk.ts';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalWindow: React.FC<Props> = ({ open, setOpen }) => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpen(false);
    setStep('email');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleResetCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetCode(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSubmitEmail = async () => {
    if (email) {
      try {
        await dispatch(sendPasswordCode(email));
        toast.success('Вы востановили свой доступ;)');
        setStep('verify');
      } catch (error) {
        console.error('Ошибка при отправке кода:', error);
      }
    }
  };

  const handleSubmitVerify = async () => {
    try {
      await dispatch(verifyResetCode({ resetCode, newPassword }));
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <Button
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'white',
            color: 'red',
          }}
        >
          <CloseOutlinedIcon />
        </Button>

        <DialogTitle style={{ textAlign: 'center' }}>
          {step === 'email' ? 'Восстановление пароля' : 'Сброс пароля'}
        </DialogTitle>
        <hr />
        <DialogContent>
          {step === 'email' ? (
            <>
              <Typography variant="body2" color="textSecondary" align="center">
                Пожалуйста, введите ваш email, чтобы мы могли отправить вам код восстановления.
              </Typography>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={handleEmailChange}
                style={{ marginTop: '30px' }}
              />
            </>
          ) : (
            <>
              <Typography variant="body2" color="textSecondary" align="center">
                Введите код из письма и новый пароль.
              </Typography>
              <TextField
                label="Код из письма"
                variant="outlined"
                fullWidth
                value={resetCode}
                onChange={handleResetCodeChange}
                style={{ marginTop: '30px' }}
              />
              <TextField
                label="Введите новый пароль"
                variant="outlined"
                fullWidth
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                style={{ marginTop: '30px' }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions
          style={{
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {step === 'email' ? (
            <Button
              onClick={handleSubmitEmail}
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#FFEB3B',
                color: 'black',
                width: 'auto',
              }}
            >
              Отправить код
            </Button>
          ) : (
            <Button
              onClick={handleSubmitVerify}
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#FFEB3B',
                color: 'black',
                width: 'auto',
              }}
            >
              Изменить пароль
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalWindow;
