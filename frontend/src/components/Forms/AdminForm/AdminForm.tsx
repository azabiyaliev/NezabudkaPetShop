import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AdminDataMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { createAdmin, getOneAdmin, updateAdmin } from '../../../store/admins/adminThunks.ts';
import {
  clearErrors,
  createLoading,
  selectAdminError,
  selectOneAdmin,
  updateLoading
} from '../../../store/admins/adminSlice.ts';
import { regEmail, regPhone } from '../../../globalConstants.ts';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';



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
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");


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
  },[dispatch, id])

  useEffect(() => {
    if (isEdit && currentAdmin) {
      setAdminData({ ...currentAdmin});
    } else  {
      setAdminData(initialAdmin);
    }
  }, [currentAdmin, isEdit]);

  useEffect(() => {
    dispatch(clearErrors())
  }, [dispatch]);


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      if (value.trim() === "") {
        setPhoneError("");
      } else {
        setPhoneError(regPhone.test(value) ? "" : "Неправильный формат телефона");
      }
    }
    if (name === "email") {
      if (value.trim() === "") {
        setEmailError("");
      } else {
        setEmailError(regEmail.test(value) ? "" : "Неправильный формат email");
      }
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = { ...adminData };

    if (isEdit && currentAdmin) {
      const isChanged = Object.keys(dataToSend).some((key) => {
        return dataToSend[key as keyof AdminDataMutation] !== currentAdmin[key as keyof AdminDataMutation];
      });

      if (!isChanged) {
        toast.info('Нет изменений для сохранения', { position: 'bottom-left' });
        return;
      }
    }

    try {
      if (isEdit) {
        await dispatch(updateAdmin({ id: Number(id), adminData })).unwrap();
        toast.success('Админ успешно обновлён!', { position: 'bottom-left' });
        navigate('/private/admin-table');
      } else {
        await dispatch(createAdmin(adminData)).unwrap();
        toast.success('Админ успешно создан!', { position: 'bottom-left' });
        navigate('/');
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
        (fieldName !== "email" && generalError.includes("email")) ||
        (fieldName !== "phone" && generalError.includes("номер"))
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

  const fields = isEdit ? allFields.filter((field) => field.name !== 'password') : allFields;

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        p: 4,
        borderRadius: 4,
        maxWidth: 900,
        mx: 'auto',
      }}
    >

      <Typography  gutterBottom sx={{ textAlign: 'center', fontWeight: 600, fontSize:"22px" }}>
        {isEdit ? 'Редактирование администратора' : 'Создание администратора'}
      </Typography>

      <Grid sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 4,
        '@media (max-width: 600px)': {
          gridTemplateColumns: '1fr',
        },
      }}>
        {fields.map((field, index) => {
          const isPhone = field.name === 'phone';
          const isEmail = field.name === 'email';

          const fieldError =
            getFieldError(field.name) || (isPhone ? phoneError : isEmail ? emailError : '');


          return (
            <Grid key={index} >
              <TextField
                variant="standard"
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                value={adminData[field.name as keyof AdminDataMutation] || ''}
                error={Boolean(fieldError)}
                helperText={fieldError || ' '}
                onChange={onChange}
                sx={{
                  "& .MuiFormHelperText-root": {
                    minHeight: "20px",
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#a3b391',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#7d996a',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#f5c518',
                  },
                  '& label.Mui-focused': {
                    color: '#354d2b',
                  },
                  '& input:-webkit-autofill': {
                    boxShadow: '0 0 0 1000px white inset',
                  },
                }}
              />
            </Grid>
          );
        })}

        {!isEdit && (
          <Grid>
            <TextField
              variant="standard"
              select
              fullWidth
              label="Роль"
              name="role"
              value={adminData.role}
              onChange={onChange}
              sx={{
                '& label': { color: '#354d2b' },
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#a3b391',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: '#7d996a',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#f5c518',
                },
                '& label.Mui-focused': {
                  color: '#354d2b',
                },

              }}
            >
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Grid>
        )}
      </Grid>
      <Grid>
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            mt: 2,
            bgcolor: '#fde910',
            color: '#333',
            fontWeight: 'bold',
            borderRadius: '30px',
            padding: '12px 0',
            textTransform: 'uppercase',
            '&:hover': { bgcolor: '#fcd400' },
          }}
          disabled={isUpdate || isCreate}
        >
          {isEdit ? 'сохранить' : 'создать'}
        </Button>
      </Grid>
    </Box>
  );
};

export default AdminForm;
