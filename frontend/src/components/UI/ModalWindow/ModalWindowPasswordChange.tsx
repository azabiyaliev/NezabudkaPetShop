import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DialogActions } from '@mui/joy';
import React, { useState } from 'react';
import { changePasswordAsync } from '../../../store/users/usersThunk.ts';
import { useAppDispatch } from "../../../app/hooks.ts";
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalWindowPasswordChange: React.FC<Props> = ({open, setOpen}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(changePasswordAsync({ currentPassword, newPassword }));
    toast.success('Вы успешно изменили пароль;)');
    setOpen(false);
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
          Смена пароля
        </DialogTitle>
        <hr />
        <DialogContent>
              <Typography variant="body2" color="textSecondary" align="center">
                Пожалуйста, введите ваш нынешний пароль.
              </Typography>
              <TextField
                label="Нынешний пароль"
                variant="outlined"
                type='password'
                fullWidth
                value={currentPassword}
                onChange={handlePasswordChange}
                style={{ marginTop: '10px', marginBottom:'20px' }}
              />
            <>
              <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '10px' }}>
                Введите новый пароль
              </Typography>
              <TextField
                label="Новый пароль"
                variant="outlined"
                type='password'
                fullWidth
                value={newPassword}
                onChange={handleNewPasswordChange}
                style={{ marginTop: '10px' }}
              />
            </>
        </DialogContent>
        <DialogActions
          style={{
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
            <Button
              onClick={handlePasswordSubmit}
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#FFEB3B',
                color: 'black',
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