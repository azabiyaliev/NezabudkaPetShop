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
};

const CompanyPageForm = () => {
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
      });
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
      await dispatch(fetchCompanyPage());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        mt: "30px",
        width: '100%',
        "@media (max-width: 900px)": {
          flexWrap: "wrap",
          flexDirection: "column",
        },
      }}
    >
      <AdminBar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
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
              mt: 5,
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
              Информация о компании:
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
      </Box>
    </Box>
  );
};

export default CompanyPageForm;
