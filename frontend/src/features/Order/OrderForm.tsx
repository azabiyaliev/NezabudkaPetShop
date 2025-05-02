import React, { FormEvent, useEffect, useState } from 'react';
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
  });
  const delivery = useAppSelector(selectDelivery);

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
  };
  await dispatch(checkoutAuthUserOrder(orderData)).unwrap();
  enqueueSnackbar("Заказ успешно оформлен!", {
    variant: "success",
  });
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
    (form.deliveryMethod !== DeliveryMethod.PickUp && !form.address)
  )

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "25px"}}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
        '@media (max-width: 1024px)': {
          flexDirection: 'column',
          gap: '15px'
        }
      }}>
        <Grid sx={{
          '@media (max-width: 1513px)': {
            width: 'auto'
          },
          '@media (max-width: 1024px)': {
            width: '100%',
            minWidth: '100%'
          }
        }}>
          <Box sx={{
            border: '1px solid #e5e2dc',
            borderRadius: '20px',
            padding: '20px',
            boxSizing: 'border-box'
          }}>
            <Typography variant="h5" sx={{
              marginBottom: '20px',
              fontWeight: 'bold',
              '@media (max-width: 600px)': {
                fontSize: '1.2rem'
              }
            }}>
              Заказ
            </Typography>

            <Box sx={{
              overflowY: 'auto',
              maxHeight: '700px',
              paddingRight: '5px',
              '@media (max-width: 1513px)': {
                maxHeight: '710px'
              }
            }}>
              <Carts products={carts.products} deleteAllProduct={() => deleteAllProducts()}/>
            </Box>

            <Box sx={{
              borderTop: '1px solid #e5e2dc',
              paddingTop: '15px',
              marginTop: '15px'
            }}>
              <TotalPrice
                products={carts.products}
                bonusUsed={form.bonusUsed || 0}
              />
            </Box>

            <Box>
              {user && user.role === "client" && (
                <Box sx={{
                  border: '1px solid #e5e2dc',
                  borderRadius: '10px',
                  padding: '15px',
                  margin: '15px 0'
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
                  margin: '15px 0',
                  '@media (max-width: 600px)': {
                    fontSize: '0.9rem'
                  }
                }}>
                  <NavLink to="/register" style={{ color: "black" }}>
                    Зарегистрируйтесь, чтобы получить бонусы
                  </NavLink>
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={disabledButton}
                sx={{
                  marginTop: '20px',
                  padding: '10px',
                  backgroundColor: '#FF9900',
                  fontWeight: 'bold',
                  '@media (max-width: 600px)': {
                    padding: '8px'
                  },
                  '&:hover': {
                    backgroundColor: '#e68a00'
                  }
                }}
              >
                Оформить заказ
              </Button>
            </Box>
          </Box>
        </Grid>

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
                    backgroundColor: form.deliveryMethod === DeliveryMethod.Delivery ? "#5F8B4C" : "transparent",
                    color: form.deliveryMethod === DeliveryMethod.Delivery ? "white" : "#5F8B4C",
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
                    backgroundColor: form.deliveryMethod === DeliveryMethod.PickUp ? "#5F8B4C" : "transparent",
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
                    backgroundColor: form.paymentMethod === PaymentMethod.ByCard ? "#5F8B4C" : "transparent",
                    color: form.paymentMethod === PaymentMethod.ByCard ? "white" : "#5F8B4C",
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
                    backgroundColor: form.paymentMethod === PaymentMethod.ByCash ? "#5F8B4C" : "transparent",
                    color: form.paymentMethod === PaymentMethod.ByCash ? "white" : "#5F8B4C",
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
                }}
              >
                <div
                  className="quill-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      delivery?.checkoutDeliveryPriceInfo ||
                      '<p>Информация пока не добавлена. <a href="/delivery">Ознакомьтесь с информацией здесь.</a></p>',
                  }}
                  style={{
                    fontSize: '16px',
                    color: '#333',
                  }}
                />
              </Paper>

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
        </Box>
      </Box>
    </form>
  );
};

export default OrderForm;