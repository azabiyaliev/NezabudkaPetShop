import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { checkoutAuthUserOrder } from '../../store/orders/ordersThunk.ts';
import { Box, Button, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { OrderMutation } from '../../types';
import { cartFromSlice, clearCart } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { deleteItemsCart, fetchCart } from '../../store/cart/cartThunk.ts';
import TotalPrice from '../../components/Domain/CustomCart/Basket/TotalPrice/TotalPrice.tsx';
import Carts from '../../components/Domain/CustomCart/Basket/Carts/Carts.tsx';
import { userRoleClient } from '../../globalConstants.ts';
import { enqueueSnackbar } from 'notistack';
import { selectDelivery } from '../../store/deliveryPage/deliveryPageSlice.ts';
import { fetchDeliveryPage } from '../../store/deliveryPage/deliveryPageThunk.ts';
import { COLORS, SPACING } from '../../globalStyles/stylesObjects.ts';
import ReCAPTCHA from 'react-google-recaptcha';

export enum PaymentMethod {
  ByCash = 'ByCash',
  ByCard = 'ByCard',
}

export enum DeliveryMethod {
  Delivery = 'Delivery',
  PickUp = 'PickUp',
}

const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;
const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;
const regAddress = /^[a-zA-Zа-яА-Я0-9\s,.-]+$/;

const OrderForm = () => {
  const dispatch = useAppDispatch();
  const [incorrectFormatEmail, setIncorrectFormatEmail] = useState("");
  const [incorrectFormatPhone, setIncorrectFormatPhone] = useState("");
  const [incorrectFormatAddress, setIncorrectFormatAddress] = useState("");
  const carts = useAppSelector(cartFromSlice);
  const user = useAppSelector(selectUser);
  const [isBonusInputDisabled, setIsBonusInputDisabled] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<OrderMutation>({
    address: "",
    userId: "",
    guestEmail: "",
    guestPhone: "",
    guestName: "",
    guestLastName: "",
    orderComment: "",
    paymentMethod: PaymentMethod.ByCash,
    bonusUsed: 0,
    deliveryMethod: DeliveryMethod.Delivery,
    items: [],
    recaptchaToken: ""
  });
  const delivery = useAppSelector(selectDelivery);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart()).unwrap();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (carts && carts.products.length > 0) {
      setForm(prev => ({
        ...prev,
        items: carts.products.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          orderAmount: item.product.productPrice * item.quantity
        }))
      }));
    }
  }, [carts]);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        guestEmail: user.email || "",
        guestPhone: user.phone || "",
        guestName: user.firstName || "",
        guestLastName: user.secondName || "",
        userId: String(user.id),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        guestEmail: "",
        guestPhone: "",
        guestName: "",
        guestLastName: "",
        userId: "",
      }));
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchDeliveryPage()).unwrap();
  }, [dispatch]);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setForm(prev => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    setForm(prev => ({
      ...prev,
      deliveryMethod: method,
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "guestPhone") {
      if (value.trim() === "") {
        setIncorrectFormatPhone("");
      } else {
        setIncorrectFormatPhone(
          regPhone.test(value) ? "" : "Неправильный формат телефона",
        );
      }
    }
    if (name === "guestEmail") {
      if (value.trim() === "") {
        setIncorrectFormatEmail("");
      } else {
        setIncorrectFormatEmail(
          regEmail.test(value) ? "" : "Неправильный формат email",
        );
      }
    }

    if (name === "address") {
      if (value.trim() === "") {
        setIncorrectFormatAddress("");
      } else {
        setIncorrectFormatAddress(
          regAddress.test(value) ? "" : "Неверный формат адреса",
        );
      }
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user && !recaptchaToken) {
      enqueueSnackbar("Пожалуйста, подтвердите что вы не робот", { variant: 'error' });
      return;
    }

    if (
      !regEmail.test(form.guestEmail) &&
      !regPhone.test(form.guestPhone) &&
      !regAddress.test(form.address) &&
      !form.guestName
    ) {
      toast.error("Введите все поля в верном формате");
      return;
    } else if (!regEmail.test(form.guestEmail)) {
      toast.error("Неправильный формат email");
      return;
    } else if (!regPhone.test(form.guestPhone)) {
      toast.error("Неверный формат телефона");
      return;
    } else if (form.deliveryMethod === 'Delivery' && !regAddress.test(form.address)) {
      toast.error("Неверный формат адреса");
      return;
    } else if (!form.guestName) {
      toast.error("Заполните поле Имя");
      return;
    } else if (!form.address) {
      toast.error("Заполните поле для Адреса")
    }

try {
  const orderData = {
    ...form,
    recaptchaToken: recaptchaToken || "",
  };
  await dispatch(checkoutAuthUserOrder(orderData)).unwrap();
  enqueueSnackbar("Заказ успешно оформлен!", {
    variant: "success",
  });
  if (!recaptchaToken) {
    enqueueSnackbar("Пожалуйста, подтвердите что вы не робот", { variant: 'error' });
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
    return;
  }
  if (!orderData.userId) {
    dispatch(clearCart())
  } else {
    if (carts?.id) {
      await dispatch(deleteItemsCart({cartId: carts.id})).unwrap()
      dispatch(clearCart());
    }
  }
  navigate("/");
} catch {
      toast.error("Ошибка при оформлении заказа")
}
  };

  const totalPrice = carts && carts.products.reduce(
    (acc, item) => {
      const itemPrice = Number(item.product.productPrice);
      const itemQuantity = Number(item.quantity);
      if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
        return acc + itemPrice * itemQuantity;
      } else {
        return acc;
      }
    },
    250,
  );

  const availableBonuses = user && !isNaN(user.bonus) ? user.bonus : 0;
  const maxBonusesToUse = !isNaN(totalPrice as number) ? Math.min(availableBonuses, totalPrice as number) : 0;

  useEffect(() => {
    setIsBonusInputDisabled(availableBonuses === 0);
  }, [availableBonuses])

  const handleBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number(e.target.value);
    if (!isNaN(parsedValue)) {
      const bonusUsed = Math.min(parsedValue, maxBonusesToUse);
      setForm((prev) => ({
        ...prev,
        bonusUsed,
      }));
    }
  };

  if (!carts) {
    return null;
  }

  const deleteAllProducts = async () => {
      if (user && (user.role === userRoleClient) && carts) {
        await dispatch(deleteItemsCart({cartId: carts.id})).unwrap();
        await dispatch(fetchCart()).unwrap();
      } else {
        dispatch(clearCart());
      }
      enqueueSnackbar("Корзина успешно очищена!", { variant: "success" });
    };

  const disabledButton = Boolean(
    !form.guestEmail ||
    !form.guestPhone ||
    !form.guestName ||
    (form.deliveryMethod !== DeliveryMethod.PickUp && !form.address) ||
    recaptchaRef === null
  )

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "25px" }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-around',
        gap: '20px',
        '@media (max-width: 950px)': {
          flexDirection: 'column',
          gap: '15px'
        }
      }}>
        <Box>
          <Carts products={carts.products} deleteAllProduct={() => deleteAllProducts()}/>
          <Box sx={{
            border: "1px solid #e5e2dc",
            padding: SPACING.xs,
            borderRadius: "20px",
            marginBottom: "20px",
          }}>
            <TotalPrice
              products={carts.products}
              bonusUsed={form.bonusUsed || 0}
            />
            <Box>
              {user && user.role === "client" && (
                <Box sx={{
                  border: '1px solid #e5e2dc',
                  borderRadius: '10px',
                  padding: SPACING.md,
                  margin: `${SPACING.xs}px 0`
                }}>
                  <Typography sx={{
                    fontSize: "16px",
                    marginBottom: '10px',
                    '@media (max-width: 600px)': {
                      fontSize: '0.9rem'
                    }
                  }}>
                    Использовать бонусы:
                  </Typography>
                  <TextField
                    fullWidth
                    label="Сколько бонусов использовать"
                    type="number"
                    value={form.bonusUsed}
                    onChange={handleBonusChange}
                    inputProps={{ min: 0, max: maxBonusesToUse }}
                    disabled={isBonusInputDisabled}
                    style={{ marginBottom: '10px' }}
                    size="small"
                  />
                  <Typography sx={{
                    '@media (max-width: 600px)': {
                      fontSize: '0.9rem'
                    }
                  }}>
                    Ваши бонусы: {availableBonuses} (Вы можете потратить до {maxBonusesToUse})
                  </Typography>
                </Box>
              )}

              {(!user || user.role !== "client") && (
                <Typography sx={{
                  paddingLeft: SPACING.xs,
                  '@media (max-width: 600px)': {
                    fontSize: '0.9rem'
                  }
                }}>
                  <NavLink to="/register" style={{ color: "black" }}>
                    Зарегистрируйтесь, чтобы получить бонусы
                  </NavLink>
                </Typography>
              )}

              <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={disabledButton}
                sx={{
                  marginTop: '20px',
                  padding: '10px',
                  backgroundColor: COLORS.DARK_GREEN,
                  fontWeight: 'bold',
                  '@media (max-width: 600px)': {
                    padding: '8px'
                  },
                  "&:hover": {
                    backgroundColor: COLORS.FOREST_GREEN,
                  },
                }}
              >
                Оформить заказ
              </Button>
            </Box>
          </Box>
        </Box>
        <Box sx={{
          marginBottom: '50px'
        }}>
          <Box sx={{
            marginBottom: '50px',
            '@media (max-width: 1024px)': {
              width: '100%',
              minWidth: '100%'
            }
          }}>
            <Box sx={{
              border: '1px solid #e5e2dc',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <Typography variant="h5" sx={{
                marginBottom: '20px',
                fontWeight: 'bold',
                '@media (max-width: 600px)': {
                  fontSize: '1.2rem'
                }
              }}>
                Персональные данные
              </Typography>

              <Grid spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Имя"
                    name="guestName"
                    value={form.guestName}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Фамилия"
                    name="guestLastName"
                    value={form.guestLastName}
                    onChange={handleChange}
                    style={{ marginBottom: '15px' }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Телефон"
                    name="guestPhone"
                    value={form.guestPhone}
                    onChange={handleChange}
                    error={Boolean(incorrectFormatPhone)}
                    placeholder="+996"
                    style={{ marginBottom: '15px' }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Эл. адрес"
                    name="guestEmail"
                    value={form.guestEmail}
                    onChange={handleChange}
                    error={Boolean(incorrectFormatEmail)}
                    style={{ marginBottom: '15px' }}
                  />
                </Grid>
                {form.deliveryMethod === 'Delivery' && (
                  <Grid>
                    <TextField
                      fullWidth
                      label="Адрес"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      error={Boolean(incorrectFormatAddress)}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
              margin: '20px 0',
              flexWrap: 'wrap',
              '@media (max-width: 768px)': {
                flexDirection: 'column',
                gap: '15px'
              }
            }}>
              <Box sx={{
                border: '1px solid #e5e2dc',
                borderRadius: '20px',
                padding: '20px',
                flex: 1,
                minWidth: '300px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                backgroundColor: '#fff',
                '@media (max-width: 768px)': {
                  width: '100%'
                }
              }}>
                <Typography variant="h6" sx={{
                  marginBottom: '20px',
                  fontWeight: '600',
                  color: '#333',
                  '@media (max-width: 600px)': {
                    fontSize: '1rem',
                    marginBottom: '15px'
                  }
                }}>
                  Способ Доставки
                </Typography>
                <Box sx={{
                  display: 'flex',
                  gap: '12px',
                  '@media (max-width: 400px)': {
                    flexDirection: 'column'
                  }
                }}>
                  <Button
                    onClick={() => handleDeliveryMethodChange(DeliveryMethod.Delivery)}
                    sx={{
                      backgroundColor: form.deliveryMethod === DeliveryMethod.Delivery ? COLORS.DARK_GREEN : "transparent",
                      color: form.deliveryMethod === DeliveryMethod.Delivery ? "white" : COLORS.DARK_GREEN,
                      border: "1px solid #5F8B4C",
                      borderRadius: '12px',
                      padding: '8px 16px',
                      textTransform: 'none',
                      fontSize: '15px',
                      fontWeight: '500',
                      flex: 1,
                      minWidth: '120px',
                      '&:hover': {
                        backgroundColor: form.deliveryMethod === DeliveryMethod.Delivery ? "#4a6d3a" : "rgba(95, 139, 76, 0.1)",
                      },
                      transition: 'all 0.2s ease',
                      '@media (max-width: 400px)': {
                        width: '100%'
                      }
                    }}
                  >
                    Доставка
                  </Button>
                  <Button
                    onClick={() => handleDeliveryMethodChange(DeliveryMethod.PickUp)}
                    sx={{
                      backgroundColor: form.deliveryMethod === DeliveryMethod.PickUp ? COLORS.DARK_GREEN : "transparent",
                      color: form.deliveryMethod === DeliveryMethod.PickUp ? "white" : "#5F8B4C",
                      border: "1px solid #5F8B4C",
                      borderRadius: '12px',
                      padding: '8px 16px',
                      textTransform: 'none',
                      fontSize: '15px',
                      fontWeight: '500',
                      flex: 1,
                      minWidth: '120px',
                      '&:hover': {
                        backgroundColor: form.deliveryMethod === DeliveryMethod.PickUp ? "#4a6d3a" : "rgba(95, 139, 76, 0.1)",
                      },
                      transition: 'all 0.2s ease',
                      '@media (max-width: 400px)': {
                        width: '100%'
                      }
                    }}
                  >
                    Самовывоз
                  </Button>
                </Box>
              </Box>

              <Box sx={{
                border: '1px solid #e5e2dc',
                borderRadius: '20px',
                padding: '20px',
                flex: 1,
                minWidth: '300px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                backgroundColor: '#fff',
                '@media (max-width: 768px)': {
                  width: '100%'
                }
              }}>
                <Typography variant="h6" sx={{
                  marginBottom: '20px',
                  fontWeight: '600',
                  color: '#333',
                  '@media (max-width: 600px)': {
                    fontSize: '1rem',
                    marginBottom: '15px'
                  }
                }}>
                  Способ Оплаты
                </Typography>
                <Box sx={{
                  display: 'flex',
                  gap: '12px',
                  '@media (max-width: 400px)': {
                    flexDirection: 'column'
                  }
                }}>
                  <Button
                    onClick={() => handlePaymentMethodChange(PaymentMethod.ByCard)}
                    sx={{
                      backgroundColor: form.paymentMethod === PaymentMethod.ByCard ? COLORS.DARK_GREEN : "transparent",
                      color: form.paymentMethod === PaymentMethod.ByCard ? "white" : COLORS.DARK_GREEN,
                      border: "1px solid #5F8B4C",
                      borderRadius: '12px',
                      padding: '8px 16px',
                      textTransform: 'none',
                      fontSize: '15px',
                      fontWeight: '500',
                      flex: 1,
                      minWidth: '120px',
                      '&:hover': {
                        backgroundColor: form.paymentMethod === PaymentMethod.ByCard ? "#4a6d3a" : "rgba(95, 139, 76, 0.1)",
                      },
                      transition: 'all 0.2s ease',
                      '@media (max-width: 400px)': {
                        width: '100%'
                      }
                    }}
                  >
                    Картой
                  </Button>
                  <Button
                    onClick={() => handlePaymentMethodChange(PaymentMethod.ByCash)}
                    sx={{
                      backgroundColor: form.paymentMethod === PaymentMethod.ByCash ? COLORS.DARK_GREEN : "transparent",
                      color: form.paymentMethod === PaymentMethod.ByCash ? "white" : COLORS.DARK_GREEN,
                      border: "1px solid #5F8B4C",
                      borderRadius: '12px',
                      padding: '8px 16px',
                      textTransform: 'none',
                      fontSize: '15px',
                      fontWeight: '500',
                      flex: 1,
                      minWidth: '120px',
                      '&:hover': {
                        backgroundColor: form.paymentMethod === PaymentMethod.ByCash ? "#4a6d3a" : "rgba(95, 139, 76, 0.1)",
                      },
                      transition: 'all 0.2s ease',
                      '@media (max-width: 400px)': {
                        width: '100%'
                      }
                    }}
                  >
                    Наличными
                  </Button>
                </Box>
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

                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    backgroundColor: '#fafafa',
                    borderRadius: 2,
                    marginBottom: '20px',
                  }}
                >
                  <div
                    className="quill-content"
                    dangerouslySetInnerHTML={{
                      __html:
                        delivery?.checkoutDeliveryPriceInfo ||
                        '<p> <a href="/delivery">Ознакомьтесь с информацией о зонах доставки здесь.</a></p>',
                    }}
                    style={{
                      fontSize: '16px',
                      color: '#333',
                    }}
                  />
                </Paper>

                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '650px',
                    height: '450px',
                    flexShrink: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    '@media (max-width: 900px)': {
                      height: '350px',
                    }
                  }}
                >
                  <iframe
                    src={delivery.map}
                    width="650px"
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
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default OrderForm;