import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Grid,
  InputAdornment, IconButton,
} from '@mui/material';
import { AdminDataMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import {
  createAdmin,
  getOneAdmin,
  updateAdmin,
} from '../../../store/admins/adminThunks.ts';
import {
  clearErrors,
  createLoading,
  selectAdminError,
  selectOneAdmin,
  updateLoading,
} from '../../../store/admins/adminSlice.ts';
import { regEmail, regPhone } from '../../../globalConstants.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import theme from '../../../globalStyles/globalTheme.ts';
import Typography from '@mui/joy/Typography';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const initialAdmin: AdminDataMutation = {
  firstName: '',
  secondName: '',
  email: '',
  phone: '',
  password: '',
  role: 'admin',
};

const AdminForm = () => {
  const [adminData, setAdminData] = useState(initialAdmin);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectAdminError);
  const currentAdmin = useAppSelector(selectOneAdmin);
  const isUpdate = useAppSelector(updateLoading);
  const isCreate = useAppSelector(createLoading);

  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      dispatch(getOneAdmin(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (isEdit && currentAdmin) {
      setAdminData({ ...currentAdmin });
    } else {
      setAdminData(initialAdmin);
    }
  }, [currentAdmin, isEdit]);

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));

    if (name === 'phone') {
      if (value.trim() === '') {
        setPhoneError('');
      } else {
        setPhoneError(regPhone.test(value) ? '' : 'Неправильный формат телефона');
      }
    }
    if (name === 'email') {
      if (value.trim() === '') {
        setEmailError('');
      } else {
        setEmailError(regEmail.test(value) ? '' : 'Неправильный формат email');
      }
    }
    if (name === 'password') {
      if (value.trim() === '') {
        setPasswordError('');
      } else {
        setPasswordError(value.length < 6 ? 'Пароль должен содержать минимум 6 символов' : '');
      }
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = { ...adminData };

    if (isEdit && currentAdmin) {
      const isChanged = Object.keys(dataToSend).some((key) => {
        return (
          dataToSend[key as keyof AdminDataMutation] !==
          currentAdmin[key as keyof AdminDataMutation]
        );
      });

      if (!isChanged) {
        enqueueSnackbar('Нет изменений для сохранения', { variant: 'warning' });
        return;
      }
    }

    try {
      if (isEdit) {
        await dispatch(updateAdmin({ id: Number(id), adminData })).unwrap();
        enqueueSnackbar('Вы успешно отредактировали администратора', {
          variant: 'success',
        });
        navigate('/private/admin-table');
      } else {
        await dispatch(createAdmin(adminData)).unwrap();
        enqueueSnackbar('Вы успешно создали администратора', {
          variant: 'success',
        });
        navigate('/private/admin-table');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFieldError = (fieldName: string) => {
    if (!error?.errors) return undefined;

    if (error.errors[fieldName]) return error.errors[fieldName];

    if (error.errors.general) {
      const generalError = error.errors.general.toLowerCase();

      if (
        (fieldName !== 'email' && generalError.includes('email')) ||
        (fieldName !== 'phone' && generalError.includes('номер'))
      ) {
        return undefined;
      }

      return error.errors.general;
    }

    return undefined;
  };

  const allFields = [
    { name: 'email', label: 'Email' },
    { name: 'firstName', label: 'Имя' },
    { name: 'password', label: 'Пароль', type: 'password' },
    { name: 'secondName', label: 'Фамилия' },
    { name: 'phone', label: 'Телефон' },
  ];

  const fields = isEdit
    ? allFields.filter((field) => field.name !== 'password')
    : allFields;

  useEffect(() => {
    document.title = "Администрация";
  }, []);

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        borderRadius: 4,
        width: '50%',
        mx: 'auto',
        "@media (max-width: 900px)": {
          width: '85%',
        },
      }}
    >
      <Typography
        level="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: theme.fonts.weight.medium,
          mb: theme.spacing.sm,
          mt: isEdit ? '20px' : 0,
          "@media (max-width: 900px)": {
            mt: isEdit ? theme.spacing.md : theme.spacing.sm,
          },
        }}
      >
        {isEdit ? 'Редактирование администратора' : 'Создание администратора'}
      </Typography>

      <Grid container spacing={0} direction="column">
        {fields.map((field, index) => {
          const isPhone = field.name === 'phone';
          const isEmail = field.name === 'email';
          const isPassword = field.name === 'password';

          const fieldError =
            getFieldError(field.name) ||
            (isPhone ? phoneError : isEmail ? emailError : isPassword ? passwordError : '');

          return (
            <Grid item xs={12} key={index}>
              <TextField
                variant="outlined"
                fullWidth
                label={field.label}
                name={field.name}
                type={isPassword ? (showPassword ? 'text' : 'password') : field.type || 'text'}
                value={adminData[field.name as keyof AdminDataMutation] || ''}
                error={Boolean(fieldError)}
                helperText={fieldError || ' '}
                onChange={onChange}
                InputProps={
                  isPassword
                    ? {
                      endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                      ),
                    }
                    : undefined
                }
                sx={{
                  backgroundColor: theme.colors.white,
                  borderRadius: theme.spacing.exs,
                }}
              />
            </Grid>
          );
        })}

        {!isEdit && (
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              select
              label="Роль"
              name="role"
              value={adminData.role}
              onChange={onChange}
              sx={{
                backgroundColor: theme.colors.white,
                borderRadius: theme.spacing.exs,
              }}
            >
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.white,
                mt: theme.spacing.sm,
                px: 4,
              }}
              disabled={isUpdate || isCreate || (!isEdit && passwordError !== '')}
            >
              {isEdit ? 'сохранить' : 'создать'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminForm;
