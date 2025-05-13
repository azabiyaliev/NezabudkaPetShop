import React, { useEffect, useState } from 'react';
import { Box } from '@mui/joy';
import { Button, Typography } from '@mui/material';
import TextEditor from '../../TextEditor/TextEditor.tsx';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import { BonusProgramPageMutation } from '../../../types';
import { selectBonusProgram } from '../../../store/bonusProgramPage/bonusProgramPageSlice.ts';
import { fetchBonusPage, updateBonusPage } from '../../../store/bonusProgramPage/bonusProgramPageThunk.ts';
import { enqueueSnackbar } from 'notistack';
import theme from '../../../globalStyles/globalTheme.ts';

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
      enqueueSnackbar('Ваш ID неверный!', { variant: 'error' });
      return;
    }
    try {
      await dispatch(updateBonusPage({ id: bonusProgram.id, data: form })).unwrap();
      enqueueSnackbar('Вы успешно отредактировали страницу "О компании"!', { variant: 'success' });
      navigate(`/bonus_program`);
      await dispatch(fetchBonusPage())
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Вам не удалось отредактировать страницу "О компании"!', { variant: 'error' });
    }
  };

  return (
    <Box>
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
              mt: theme.spacing.sm,
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