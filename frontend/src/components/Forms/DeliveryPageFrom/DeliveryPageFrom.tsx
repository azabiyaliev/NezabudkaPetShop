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
import TextEditor, { deliveryPriceInfoTemplate } from '../../TextEditor/TextEditor.tsx';
import TextField from '@mui/material/TextField';
import AdminBar from '../../../features/Admin/AdminProfile/AdminBar.tsx';

const initialState = {
  text: "",
  price: '',
  map: '',
  checkoutDeliveryPriceInfo: ''
}

const DELIVERY_MAP_REGEX = /https:\/\/www\.google\.com\/maps\/d\/u\/\d\/embed\?mid=[A-Za-z0-9_-]+/;

const DeliveryPageForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<DeliveryPageMutation>(initialState);
  const [mapError, setMapError] = useState<string | null>(null);
  const delivery = useAppSelector(selectDelivery);
  const [checkoutPriceError, setCheckoutPriceError] = useState<string | null>(null);

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

  const onChangeEditorCheckoutDeliveryPriceInfo = (html: string) => {
    const priceRegex = /\d+\s*сом/g;
    const prices = html.match(priceRegex) || [];
    const hasZeroPrice = prices.some(price => parseInt(price.replace(/\D/g, ''), 10) === 0);

    if (hasZeroPrice) {
      setCheckoutPriceError("Цена в зоне доставки не может быть равна нулю.");
      return;
    } else {
      setCheckoutPriceError(null);
    }

    setForm((prevState) => ({
      ...prevState,
      checkoutDeliveryPriceInfo: html,
    }));
  }

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

  const stripHtmlTags = (html: string) => html.replace(/<[^>]*>/g, "").trim();
  const removeNumbersAndSom = (text: string) =>
    text.replace(/\d+\s*сом/g, '').replace(/\s+/g, ' ').trim();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivery?.id) {
      toast.error("Ваш id неверный!");
      return;
    }

    const priceRegex = /\d+\s*сом/g;
    const prices = form.checkoutDeliveryPriceInfo.match(priceRegex) || [];
    const hasZeroPrice = prices.some(price => parseInt(price.replace(/\D/g, ''), 10) === 0);

    if (hasZeroPrice) {
      setCheckoutPriceError("Цена в зоне доставки не может быть равна нулю.");
      return;
    } else {
      setCheckoutPriceError(null);
    }

    const plainTextCheckoutPriceInfo = removeNumbersAndSom(stripHtmlTags(form.checkoutDeliveryPriceInfo));
    const plainTextTemplate = removeNumbersAndSom(stripHtmlTags(deliveryPriceInfoTemplate));

    if (plainTextCheckoutPriceInfo !== plainTextTemplate) {
      setCheckoutPriceError("Пожалуйста, используйте правильный шаблон для информации о цене доставки.");
      return;
    } else {
      setCheckoutPriceError(null);
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
    <div className="d-flex">
      <div className="col-3 mt-5">
        <AdminBar />
      </div>

      <div className="col-9 mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              mt: 4,
              mb: 3,
              fontWeight: 'bold',
              color: 'black',
            }}
          >
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
              gap: 4,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ alignSelf: 'flex-start', fontWeight: 500 }}
            >
              Введите информацию о доставке:
            </Typography>

            <TextEditor
              value={form.text}
              onChange={onChangeEditorText}
              error={!form.text}
              helperText={!form.text ? 'Поле обязательно для заполнения' : undefined}
            />

            <Typography
              variant="subtitle1"
              sx={{ mb: 1, alignSelf: 'flex-start', fontWeight: 500 }}
            >
              Введите информацию о зонах доставки :
            </Typography>

            <TextEditor
              value={form.price}
              onChange={onChangeEditorPrice}
              error={!form.price}
              helperText={!form.price ? 'Поле обязательно для заполнения' : undefined}
            />

            <Typography
              variant="subtitle1"
              sx={{ mb: 1, alignSelf: 'flex-start', fontWeight: 500 }}
            >
              Цена за зону доставки
            </Typography>
            <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
            <TextEditor
              value={form.checkoutDeliveryPriceInfo}
              onChange={onChangeEditorCheckoutDeliveryPriceInfo}
              error={!!checkoutPriceError}
              placeholder={deliveryPriceInfoTemplate}
              helperText={checkoutPriceError || (form.checkoutDeliveryPriceInfo ? undefined : 'Поле обязательно для заполнения')}
            />
              <Box>
              <Typography>Шаблон</Typography>
              <Typography sx={{ color: 'gray', width: '254px' }}>
                {deliveryPriceInfoTemplate}
              </Typography>
              </Box>
            </Box>
            {delivery?.map && (
              <Box
                sx={{
                  width: '100%',
                  height: {
                    xs: '300px',
                    md: '400px',
                  },
                  borderRadius: '12px',
                }}
              >

                <iframe
                  src={delivery.map}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Delivery map"
                />
              </Box>
            )}

            <TextField
              label="Ссылка на карту"
              value={form.map}
              onChange={handleMapChange}
              fullWidth
              required
              error={!!mapError}
              helperText={mapError || ''}
              sx={{ mt: 2 }}
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
    </div>
  );

};

export default DeliveryPageForm;
