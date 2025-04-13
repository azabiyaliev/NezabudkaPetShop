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
          Редактировать страницу "Бонусная программа"
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

export default BonusProgramForm;