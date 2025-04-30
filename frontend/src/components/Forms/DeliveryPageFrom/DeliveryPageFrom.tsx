import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { DeliveryPageMutation } from '../../../types';
import { selectDelivery } from '../../../store/deliveryPage/deliveryPageSlice.ts';
import { toast } from 'react-toastify';
import { enqueueSnackbar } from 'notistack';
import { fetchDeliveryPage, updateDeliveryPage } from '../../../store/deliveryPage/deliveryPageThunk.ts';
import { Box } from '@mui/joy';
import { Button, Typography } from '@mui/material';
import TextEditor from '../../TextEditor/TextEditor.tsx';
import TextField from '@mui/material/TextField';
import AdminBar from '../../../features/Admin/AdminProfile/AdminBar.tsx';

const initialState = {
  text: "",
  price: '',
  map: '',
}

const DELIVERY_MAP_REGEX = /https:\/\/www\.google\.com\/maps\/d\/u\/\d\/embed\?mid=[A-Za-z0-9_-]+/;

const DeliveryPageForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<DeliveryPageMutation>(initialState);
  const [mapError, setMapError] = useState<string | null>(null);
  const delivery = useAppSelector(selectDelivery);

  useEffect(() => {
    dispatch(fetchDeliveryPage())
      .unwrap()
      .then((delivery) => {
        if (delivery) {
          setForm(delivery);
        }
      })
  }, [dispatch]);

  const onChangeEditorText = (html: string) => {
    setForm((prevState) => ({
      ...prevState,
      text: html,
    }));
  };

  const onChangeEditorPrice = (html: string) => {
    setForm((prevState) => ({
      ...prevState,
      price: html,
    }));
  };

  const handleMapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mapValue = e.target.value;
    setForm((prevState) => ({
      ...prevState,
      map: mapValue,
    }));

    if (!DELIVERY_MAP_REGEX.test(mapValue)) {
      setMapError("Неверный формат ссылки на карту.");
    } else {
      setMapError(null);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivery?.id) {
      toast.error("Ваш id неверный!");
      return;
    }
    try {
      await dispatch(updateDeliveryPage({ id: delivery.id, data: form })).unwrap();
      enqueueSnackbar('Вы успешно отредактировали страницу "Доставка и оплата"!', { variant: 'success' });
      navigate(`/delivery`);
      await dispatch(fetchDeliveryPage())
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: "flex", margin: "30px 0" }}>
      <Box sx={{ minWidth: 499 }}>
        <AdminBar />
      </Box>

      <div className="col-9 mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
            Редактирование страницы «Доставка и оплата»
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
              mt:5,
            }}
          >
            <Box sx={{mb: 5}}>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: 'flex-start',
                  color: 'text.secondary',
                  fontWeight: 400,
                  mb: 0.5,
                }}
              >
                Информация о доставке:
              </Typography>

              <TextEditor
                value={form.text}
                onChange={onChangeEditorText}
                error={!form.text}
                helperText={!form.text ? 'Поле обязательно для заполнения' : undefined}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                alignSelf: 'flex-start',
                color: 'text.secondary',
                fontWeight: 400,
                mb: 0.5,
              }}
            >
              Информация о зонах доставки:
            </Typography>
            <TextEditor
              value={form.price}
              onChange={onChangeEditorPrice}
              error={!form.price}
              helperText={!form.price ? 'Поле обязательно для заполнения' : undefined}
            />

            <TextField
              label="Ссылка на карту"
              value={form.map}
              onChange={handleMapChange}
              fullWidth
              required
              error={!!mapError}
              helperText={mapError || ''}
              sx={{ mt: 5 }}
            />

            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 3, alignSelf: 'center', backgroundColor: 'darkgreen' }}
              disabled={!!mapError}
            >
              Сохранить
            </Button>
          </Box>
        </Box>
      </div>
    </Box>
  );

};

export default DeliveryPageForm;
