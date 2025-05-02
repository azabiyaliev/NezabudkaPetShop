import React, { useEffect, useState } from 'react';
import { Box } from '@mui/joy';
import { Button, Typography } from '@mui/material';
import TextEditor from '../../TextEditor/TextEditor.tsx';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import { BonusProgramPageMutation } from '../../../types';
import { selectBonusProgram } from '../../../store/bonusProgramPage/bonusProgramPageSlice.ts';
import { fetchCompanyPage, updateCompanyPage } from '../../../store/companyPage/companyPageThunk.ts';
import { fetchBonusPage } from '../../../store/bonusProgramPage/bonusProgramPageThunk.ts';
import { toast } from 'react-toastify';
import { enqueueSnackbar } from 'notistack';
import AdminBar from '../../../features/Admin/AdminProfile/AdminBar.tsx';

const initialState = {
  text: ""
}

const BonusProgramForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<BonusProgramPageMutation>(initialState);
  const bonusProgram = useAppSelector(selectBonusProgram);

  useEffect(() => {
    dispatch(fetchBonusPage())
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
    if (!bonusProgram?.id) {
      toast.error("Ваш id неверный!");
      return;
    }
    try {
      await dispatch(updateCompanyPage({ id: bonusProgram.id, data: form })).unwrap();
      enqueueSnackbar('Вы успешно отредактировали страницу "О компании"!', { variant: 'success' });
      navigate(`/my_company`);
      await dispatch(fetchCompanyPage())
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mt: 4,
        px: { xs: 2, md: 4 },
        width: '100%',
      }}
    >
      <Box sx={{ width: { xs: '100%', md: '500px' }, flexShrink: 0 }}>
        <AdminBar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: 'center', fontWeight: 600 }}
          >
            Редактирование страницы «Бонусная программа»
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
              Информация о бонусной программе:
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
              sx={{
                mt: 3,
                alignSelf: 'center',
                backgroundColor: 'darkgreen',
              }}
            >
              Сохранить
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );

};

export default BonusProgramForm;