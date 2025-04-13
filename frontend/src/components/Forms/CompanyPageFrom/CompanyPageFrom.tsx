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
      <div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3 }}>
            Редактировать страницу "О компании"
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={submitHandler}
            sx={{
              width: '800px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
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
  );
};

export default CompanyPageFrom;