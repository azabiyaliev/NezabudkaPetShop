import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { checkoutAuthUserOrder } from '../../store/orders/ordersThunk.ts';
import { Box, Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
import { COLORS, FONTS, SPACING } from '../../globalStyles/stylesObjects.ts';
import ReCAPTCHA from 'react-google-recaptcha';

export enum PaymentMethod {
  ByCash = 'ByCash',
  ByCard = 'ByCard',
}

export enum DeliveryMethod {
  Delivery = 'Delivery',
  PickUp = 'PickUp',
}

const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;
const regAddress = /^[a-zA-Zа-яА-Я0-9\s,.'-]*$/;

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
    recaptchaToken: "",
    totalPrice: 0,
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
          orderAmount: item.product.productPrice * item.quantity,
          productName: item.product.productName,
          productPhoto: item.product.productPhoto,
          promoPrice: item.product.promoPrice ?? 0,
          productPrice: item.product.productPrice,
          promoPercentage: item.product.promoPercentage ?? null,
          sales: item.product.sales,
        })),
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

  const isFormValid = (): boolean => {
    if (!regEmail.test(form.guestEmail)) {
      enqueueSnackbar('Некорректный формат email', { variant: 'error' });
      return false;
    }
    if (!regPhone.test(form.guestPhone)) {
      enqueueSnackbar('Некорректный формат телефона', { variant: 'error' });
      return false;
    }
    if (
      form.deliveryMethod === DeliveryMethod.Delivery &&
      !regAddress.test(form.address)
    ) {
      enqueueSnackbar('Некорректный адрес доставки', { variant: 'error' });
      return false;
    }
    return true;
  };

  const productsToBuy: { price: number; amount: number }[] = carts.products.map(
    (product) => {
      if (product.product) {
        if (product.product.sales) {
          return {
            price: product.product.promoPrice,
            amount: product.quantity,
          };
        } else {
          return {
            price: product.product.productPrice,
            amount: product.quantity,
          };
        }
      } else {
        return { price: 0, amount: 0 };
      }
    },
  );

  const totalPriceProduct: number = productsToBuy.reduce(
    (acc: number, item: { price: number; amount: number }) => {
      return acc + item.price * item.amount;
    },
    0,
  );

  const bonusToReceive = totalPriceProduct * 0.01
  const finalTotalPrice: number = totalPriceProduct - (form.bonusUsed ? form.bonusUsed : 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      enqueueSnackbar('Пройдите проверку ReCAPTCHA', { variant: 'error' });
      return;
    }

    if(!isFormValid) return

    try {
      const orderData = {
        ...form,
        totalPrice: Number(finalTotalPrice),
        recaptchaToken,
      };
      await dispatch(checkoutAuthUserOrder(orderData)).unwrap();
      enqueueSnackbar("Заказ успешно оформлен!", {
        variant: "success",
      });
      if (!orderData.userId) {
        dispatch(clearCart())
      } else if (carts?.id) {
        await dispatch(deleteItemsCart({cartId: carts.id})).unwrap()
        dispatch(clearCart());
      }
      navigate("/");
    } catch {
          enqueueSnackbar("Ошибка при оформлении заказа", {
            variant: "error",
          });
    } finally {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
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
    <form onSubmit={handleSubmit} style={{ marginTop: SPACING.md }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: SPACING.md,
          '@media (max-width: 950px)': {
            flexDirection: 'column',
            gap: SPACING.sm,
          },
        }}
      >
        <Box>
          <Carts products={carts.products} deleteAllProduct={() => deleteAllProducts()} />
          <Box
            sx={{
              border: `1px solid ${COLORS.BORDER_CART}`,
              padding: SPACING.sm,
              borderRadius: SPACING.radius,
              marginBottom: SPACING.md,
              '@media (max-width: 480px)': {
                display: 'none',
              }
            }}
          >
            <TotalPrice bonusToReceive={bonusToReceive} bonusUsed={form.bonusUsed || 0} totalPriceProduct={totalPriceProduct} finalTotalPrice={finalTotalPrice}/>
            <Box>
              {user && user.role === 'client' && (
                <Box
                  sx={{
                    border: `1px dotted ${COLORS.BORDER_CART}`,
                    padding: SPACING.sm,
                    margin: `${SPACING.xs} 0`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: FONTS.size.default,
                      marginBottom: SPACING.sm,
                      '@media (max-width: 600px)': {
                        fontSize: FONTS.size.sm,
                      },
                    }}
                  >
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
                    style={{ marginBottom: SPACING.sm }}
                    size="small"
                  />
                  <Typography
                    sx={{
                      '@media (max-width: 600px)': {
                        fontSize: FONTS.size.sm,
                      },
                    }}
                  >
                    Ваши бонусы: {availableBonuses} (Вы можете потратить до {maxBonusesToUse})
                  </Typography>
                </Box>
              )}

              {!user && (
                <Typography
                  sx={{
                    paddingLeft: SPACING.xs,
                    '@media (max-width: 600px)': {
                      fontSize: FONTS.size.sm,
                    },
                  }}
                >
                  <NavLink to="/register" style={{ color: COLORS.text }}>
                    Зарегистрируйтесь, чтобы получить бонусы
                  </NavLink>
                </Typography>
              )}

              <Box
                sx={{
                  my: SPACING.sm,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
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

        <Box
          sx={{
            marginBottom: SPACING.xxxl,
          }}
        >
          <Box
            sx={{
              marginBottom: SPACING.xxxl,
              '@media (max-width: 1024px)': {
                width: '100%',
                minWidth: '100%',
              },
            }}
          >
            <Box
              sx={{
                border: `1px solid ${COLORS.BORDER_CART}`,
                borderRadius: SPACING.radius,
                padding: SPACING.md,
                marginBottom: SPACING.md,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  marginBottom: SPACING.md,
                  fontWeight: FONTS.weight.bold,
                  '@media (max-width: 600px)': {
                    fontSize: FONTS.size.lg,
                  },
                }}
              >
                Персональные данные
              </Typography>

              <Grid
                spacing={SPACING.sm}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <TextField
                  fullWidth
                  label="Имя"
                  name="guestName"
                  value={form.guestName}
                  onChange={handleChange}
                  style={{ marginBottom: SPACING.sm }}
                />
                <TextField
                  fullWidth
                  label="Фамилия"
                  name="guestLastName"
                  value={form.guestLastName}
                  onChange={handleChange}
                  style={{ marginBottom: SPACING.sm }}
                />
                <TextField
                  fullWidth
                  label="Телефон"
                  name="guestPhone"
                  value={form.guestPhone}
                  onChange={handleChange}
                  error={Boolean(incorrectFormatPhone)}
                  helperText={incorrectFormatPhone}
                  placeholder="+996"
                  style={{ marginBottom: SPACING.sm }}
                />
                <TextField
                  fullWidth
                  label="Эл. адрес"
                  name="guestEmail"
                  value={form.guestEmail}
                  onChange={handleChange}
                  error={Boolean(incorrectFormatEmail)}
                  helperText={incorrectFormatEmail}
                  style={{ marginBottom: SPACING.sm }}
                />
                {form.deliveryMethod === 'Delivery' && (
                  <TextField
                    fullWidth
                    label="Адрес"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    error={Boolean(incorrectFormatAddress)}
                    helperText={incorrectFormatAddress}
                  />
                )}
              </Grid>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: SPACING.md,
                margin: `${SPACING.md} 0`,
                flexWrap: 'wrap',
                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                  gap: SPACING.sm,
                },
              }}
            >
              <Box
                sx={{
                  border: `1px solid ${COLORS.BORDER_CART}`,
                  borderRadius: SPACING.radius,
                  padding: SPACING.md,
                  flex: 1,
                  minWidth: '300px',
                  backgroundColor: COLORS.white,
                  '@media (max-width: 768px)': {
                    width: '100%',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: SPACING.radius,
                    fontWeight: FONTS.weight.medium,
                    color: COLORS.text,
                    '@media (max-width: 600px)': {
                      fontSize: FONTS.size.default,
                    },
                  }}
                >
                  Способ Доставки
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: SPACING.sm,
                    '@media (max-width: 400px)': {
                      flexDirection: 'column',
                    },
                  }}
                >
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
                border: `1px solid ${COLORS.BORDER_CART}`,
                borderRadius: SPACING.radius,
                padding: SPACING.md,
                flex: 1,
                minWidth: '300px',
                backgroundColor: COLORS.white,
                '@media (max-width: 768px)': {
                  width: '100%',
                },
              }}>
                <Typography variant="h6" sx={{
                  marginBottom: SPACING.radius,
                  fontWeight: FONTS.weight.medium,
                  color: COLORS.text,
                  '@media (max-width: 600px)': {
                    fontSize: FONTS.size.default,
                  },
                }}>
                  Способ Оплаты
                </Typography>
                <Box sx={{
                  display: 'flex',
                  gap: SPACING.sm,
                  '@media (max-width: 400px)': {
                    flexDirection: 'column',
                  },
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
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    marginBottom: '20px',
                    border: `1px solid ${COLORS.BORDER_CART}`,
                  }}
                >
                  <Link to='/delivery'>
                    Ознакомьтесь с информацией о зонах доставки здесь.
                  </Link>
                </Box>
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
            <Box
              sx={{
                border: `1px solid ${COLORS.BORDER_CART}`,
                padding: SPACING.sm,
                borderRadius: SPACING.xl,
                marginBottom: SPACING.md,
                display: 'none',
                '@media (max-width: 480px)': {
                  display: 'block',
                  marginTop: '200px',
                }
              }}
            >
              <TotalPrice bonusToReceive={bonusToReceive} bonusUsed={form.bonusUsed || 0} totalPriceProduct={totalPriceProduct} finalTotalPrice={finalTotalPrice}/>
              <Box>
                {user && user.role === 'client' && (
                  <Box
                    sx={{
                      border: `1px solid ${COLORS.BORDER_CART}`,
                      borderRadius: SPACING.sm,
                      padding: SPACING.sm,
                      margin: `${SPACING.xs} 0`,
                      backgroundColor: COLORS.background,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: FONTS.size.default,
                        marginBottom: SPACING.sm,
                        '@media (max-width: 600px)': {
                          fontSize: FONTS.size.sm,
                        },
                      }}
                    >
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
                      style={{ marginBottom: SPACING.sm }}
                      size="small"
                    />
                    <Typography
                      sx={{
                        '@media (max-width: 600px)': {
                          fontSize: FONTS.size.sm,
                        },
                      }}
                    >
                      Ваши бонусы: {availableBonuses} (Вы можете потратить до {maxBonusesToUse})
                    </Typography>
                  </Box>
                )}

                {!user && (
                  <Typography
                    sx={{
                      paddingLeft: SPACING.xs,
                      '@media (max-width: 600px)': {
                        fontSize: FONTS.size.sm,
                      },
                    }}
                  >
                    <NavLink to="/register" style={{ color: COLORS.text }}>
                      Зарегистрируйтесь, чтобы получить бонусы
                    </NavLink>
                  </Typography>
                )}

                <Box
                  sx={{
                    my: SPACING.sm,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
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
                    marginTop: SPACING.md,
                    padding: SPACING.sm,
                    backgroundColor: COLORS.yellow,
                    color: COLORS.contrastText,
                    fontWeight: FONTS.weight.bold,
                    '@media (max-width: 600px)': {
                      padding: SPACING.xs,
                    },
                    '&:hover': {
                      backgroundColor: COLORS.warning,
                    },
                  }}
                >
                  Оформить заказ
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default OrderForm;