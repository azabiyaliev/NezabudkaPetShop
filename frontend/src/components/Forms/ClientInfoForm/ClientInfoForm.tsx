import React, { useEffect, useState } from 'react';
import { Box } from '@mui/joy';
import { Button, Typography } from '@mui/material';
import TextEditor from '../../TextEditor/TextEditor.tsx';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import { ClientInfoMutation } from '../../../types';
import { fetchCompanyPage } from '../../../store/companyPage/companyPageThunk.ts';
import { toast } from 'react-toastify';
import { enqueueSnackbar } from 'notistack';
import AdminBar from '../../../features/Admin/AdminProfile/AdminBar.tsx';
import { selectClientInfo } from "../../../store/clientInfo/clientInfoSlice.ts";
import { fetchClientInfo, updateClientInfo } from '../../../store/clientInfo/clientInfoThunk.ts';

const initialState = {
  information: ""
}

const AdminInfoForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<ClientInfoMutation>(initialState);
  const clientInfo = useAppSelector(selectClientInfo);

  useEffect(() => {
    dispatch(fetchClientInfo())
      .unwrap()
      .then((client) => {
        if (client) {
          setForm(client);
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
    if (!clientInfo?.id) {
      toast.error("Ваш id неверный!");
      return;
    }
    try {
      await dispatch(updateClientInfo({ id: clientInfo.id, data: form })).unwrap();
      enqueueSnackbar('Вы успешно отредактировали личный кабинет для клиентов', { variant: 'success' });
      navigate(`/client_info/${clientInfo.id}`);
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
            Редактирование личного кабинета для клиентов
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
              mt:"30px",
            }}
          >

            <Typography
              variant="body2"
              sx={{
                alignSelf: 'flex-start',
                color: 'text.secondary',
                fontWeight: 400,
                mb: 0.5,
              }}
            >
              Информация для клиентов:
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