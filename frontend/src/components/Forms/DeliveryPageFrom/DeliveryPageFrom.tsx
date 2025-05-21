import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { DeliveryPageMutation } from '../../../types';
import { selectDelivery } from '../../../store/deliveryPage/deliveryPageSlice.ts';
import { toast } from 'react-toastify';
import { enqueueSnackbar } from 'notistack';
import { fetchDeliveryPage, updateDeliveryPage } from '../../../store/deliveryPage/deliveryPageThunk.ts';
import { Box } from '@mui/joy';
import { Button, Grid, Typography } from "@mui/material";
import TextEditor, { deliveryPriceInfoTemplate } from '../../TextEditor/TextEditor.tsx';
import TextField from '@mui/material/TextField';
import theme from '../../../globalStyles/globalTheme.ts';

const initialState = {
  text: "",
  price: '',
  map: '',
  checkoutDeliveryPriceInfo: ''
}

const transformMapLink = (link: string) => {
  if (!link) return '';
  return link.replace('/edit?mid=', '/embed?mid=');
}

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
      .then((deliveryData) => {
        if (deliveryData) {
          const transformedData = {
            ...deliveryData,
            map: transformMapLink(deliveryData.map),
          };

          setForm(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(transformedData)) {
              return transformedData;
            }
            return prev;
          });
        }
      });
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
    if (html === form.checkoutDeliveryPriceInfo) return;

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
  };

  const handleMapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let mapValue = e.target.value;
    if (mapValue.includes('/edit?mid=')) {
      mapValue = mapValue.replace('/edit?mid=', '/embed?mid=');
    }

    setForm((prevState) => ({
      ...prevState,
      map: mapValue,
    }));

    if (!mapValue.includes('/embed?mid=')) {
      setMapError("Ссылка должна содержать '/embed?mid='.");
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
      enqueueSnackbar('Ваш ID неверный!', { variant: 'error' });
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
      await dispatch(fetchDeliveryPage());
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Вам не удалось отредактировать страницу "Доставка и оплата"!', { variant: 'error' });
    }
  };

  useEffect(() => {
    document.title = "Редактирование страницы «Доставка и оплата»";
  }, []);

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
              mt: theme.spacing.sm,
            }}
          >
            <Box sx={{ mb: theme.spacing.sm }}>
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

            <Typography
              variant="body2"
              sx={{
                alignSelf: 'flex-start',
                color: 'text.secondary',
                fontWeight: 400,
                mb: 0.5,
                mt: theme.spacing.sm,
              }}
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
            <Box sx={{ mt: theme.spacing.lg, width: '100%' }}>
              <Grid container spacing={2} alignItems="flex-start">

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Ссылка на карту"
                    value={form.map}
                    onChange={handleMapChange}
                    fullWidth
                    required
                    error={!!mapError}
                    helperText={mapError || ''}
                  />
                  <Box sx={{ mt: 1, p: 1, bgcolor: theme.colors.rgbaGrey, border: `1px dashed ${theme.colors.DARK_GRAY}`, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Как вставить карту Google:
                    </Typography>
                    <Typography variant="caption" component="div" color="text.secondary">
                      1. Откройте <b>Google My Maps</b> и создайте карту.<br />
                      2. Нажмите <b>"Поделиться"</b>.<br />
                      3. Скопируйте ссылку<br />
                      4. Вставьте её в поле выше.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      flex: '0 1 450px',
                      width: '100%',
                      maxWidth: '350px',
                      height: '350px',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      order: { xs: 1, md: 2 },
                      float: "right",
                    }}
                  >
                    {form.map && (
                      <iframe
                        src={form.map}
                        width="600px"
                        height="600px"
                        style={{
                          position: 'absolute',
                          top: '-70px',
                          border: 0,
                        }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

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
      </Box>
    </Box>
  );
};

export default DeliveryPageForm;
