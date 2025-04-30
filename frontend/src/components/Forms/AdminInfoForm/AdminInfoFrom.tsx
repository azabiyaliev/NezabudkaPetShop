import React, { useEffect, useState } from 'react';
import { Box } from '@mui/joy';
import { Button, Typography } from '@mui/material';
import TextEditor from '../../TextEditor/TextEditor.tsx';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import { AdminInfoMutation } from '../../../types';
import { fetchCompanyPage } from '../../../store/companyPage/companyPageThunk.ts';
import { toast } from 'react-toastify';
import { enqueueSnackbar } from 'notistack';
import AdminBar from '../../../features/Admin/AdminProfile/AdminBar.tsx';
import { selectAdminInfo } from '../../../store/adminInfo/adminInfoSlice.ts';
import { fetchAdminInfo, updateAdminInfo } from '../../../store/adminInfo/adminInfoThunk.ts';

const initialState = {
  information: ""
}

const AdminInfoForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminInfoMutation>(initialState);
  const adminInfo = useAppSelector(selectAdminInfo);

  useEffect(() => {
    dispatch(fetchAdminInfo())
      .unwrap()
      .then((admin) => {
        if (admin) {
          setForm(admin);
        }
      })
  }, [dispatch]);

  const onChangeEditor = (html: string) => {
    setForm((prevState) => ({
      ...prevState,
      information: html,
    }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminInfo?.id) {
      toast.error("Ваш id неверный!");
      return;
    }
    try {
      await dispatch(updateAdminInfo({ id: adminInfo.id, data: form })).unwrap();
      enqueueSnackbar('Вы успешно отредактировали личный кабинет для администрации', { variant: 'success' });
      navigate(`/admin_info/${adminInfo.id}`);
      await dispatch(fetchCompanyPage())
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex">
      <div className="col-3 mt-5">
        <AdminBar />
      </div>

      <div className="col-9 mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
            Редактирование личного кабинета для администариции
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={submitHandler}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, alignSelf: 'flex-start', fontWeight: 500 }}
            >
             Информация для администрации:
            </Typography>

            <TextEditor
              value={form.information}
              onChange={onChangeEditor}
              error={!form.information}
              helperText={!form.information ? 'Поле обязательно для заполнения' : undefined}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 3, alignSelf: 'center', backgroundColor: 'darkgreen' }}
            >
              Сохранить
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );

};

export default AdminInfoForm;