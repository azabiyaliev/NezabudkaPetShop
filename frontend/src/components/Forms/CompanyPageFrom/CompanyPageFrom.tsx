import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { CompanyPageMutation } from '../../../types';
import { selectCompany } from '../../../store/companyPage/compantPageSlice.ts';
import TextEditor from '../../TextEditor/TextEditor.tsx';
import { Button, Typography } from '@mui/material';
import { fetchCompanyPage, updateCompanyPage } from '../../../store/companyPage/companyPageThunk.ts';
import { toast } from 'react-toastify';
import { enqueueSnackbar } from 'notistack';
import { Box } from '@mui/joy';
import AdminBar from '../../../features/Admin/AdminProfile/AdminBar.tsx';

const initialState = {
  text: ""
}

const CompanyPageFrom = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<CompanyPageMutation>(initialState);
  const company = useAppSelector(selectCompany);

  useEffect(() => {
    dispatch(fetchCompanyPage())
      .unwrap()
      .then((company) => {
        if (company) {
          setForm(company);
        }
      })
  }, [dispatch]);

  const onChangeEditor = (html: string) => {
    setForm((prevState) => ({
      ...prevState,
      text: html,
    }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.id) {
      toast.error("Ваш id неверный!");
      return;
    }
    try {
      await dispatch(updateCompanyPage({ id: company.id, data: form })).unwrap();
      enqueueSnackbar('Вы успешно отредактировали страницу "О компании"!', { variant: 'success' });
      navigate(`/my_company`);
      await dispatch(fetchCompanyPage())
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex ">
      <div className="col-3 mt-5 ">
        <AdminBar />
      </div>
      <div className="col-9 mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mt: 4,
              mb: 3,
              fontWeight: "bold",
              color: "black",
            }}
          >
            Редактирование страницы «О компании»
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
              sx={{ mb: 1, alignSelf: 'flex-start', fontWeight: 500, ml:3}}
            >
              Введите информацию о компании:
            </Typography>

            <TextEditor
              value={form.text}
              onChange={onChangeEditor}
              error={!form.text}
              helperText={!form.text ? 'Поле обязательно для заполнения' : undefined}
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

export default CompanyPageFrom;
