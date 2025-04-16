import React, { FormEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { checkoutAuthUserOrder } from '../../store/orders/ordersThunk.ts';
import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { OrderMutation } from '../../types';
import { cartFromSlice, clearCart } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { fetchCart } from '../../store/cart/cartThunk.ts';
import TotalPrice from '../../components/Domain/CustomCart/Basket/TotalPrice/TotalPrice.tsx';

enum PaymentMethod {
  ByCash = 'ByCash',
  ByCard = 'ByCard',
}

enum DeliveryMethod {
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

  useEffect(() => {
    if (user) {
      dispatch(fetchCart({ token: user.token })).unwrap();
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
    }


    const orderData = {
      ...form,
    };


    await dispatch(checkoutAuthUserOrder(orderData)).unwrap();
    toast.success("Заказ успешно оформлен!");
    dispatch(clearCart())
    navigate("/all-products");
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

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "35px" }}>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e5e2dc",
          width: "700px",
          padding: "2rem",
          borderRadius: "20px",
          marginBottom: "20px",
          "@media (max-width: 820px)": {
            padding: "1rem",
            width: "600px",
          },
          "@media (max-width: 720px)": {
            width: "100%",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            fontFamily: "Nunito, sans-serif",
            marginBottom: "17px",
            "@media(max-width: 517px)": {
              fontSize: "30px",
            },
            "@media(max-width: 408px)": {
              fontSize: "20px",
            },
          }}
        >
          2. Личная информация
        </Typography>
        <Grid
          sx={{
            display: "flex",
            gap: "20px",
            "@media(max-width: 500px)": {
              display: "inline-block",
            },
          }}
        >
          <TextField
            InputLabelProps={{
              shrink: true,
              required: true,
              sx: {
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
                color: "#000",
              },
            }}
            InputProps={{
              style: {
                borderRadius: "15px",
              },
            }}
            sx={{
              width: "100%",
              "@media(max-width: 500px)": {
                paddingBottom: "17px",
              },
            }}
            label="Имя"
            name="guestName"
            value={form.guestName}
            onChange={handleChange}
          />

          <TextField
            InputLabelProps={{
              shrink: true,
              required: true,
              sx: {
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
                color: "#000",
              },
            }}
            InputProps={{
              style: {
                borderRadius: "15px",
              },
            }}
            sx={{
              width: "100%",
            }}
            label="Фамилия"
            placeholder="Фамилия"
            name="guestLastName"
            value={form.guestLastName}
            onChange={handleChange}
          />
        </Grid>

        <Grid
          sx={{
            display: "flex",
            gap: "20px",
            "@media(max-width: 500px)": {
              display: "inline-block",
            },
          }}
        >
          <TextField
            InputLabelProps={{
              shrink: true,
              required: true,
              sx: {
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
                color: "#000",
              },
            }}
            InputProps={{
              style: {
                borderRadius: "15px",
              },
            }}
            sx={{
              width: "100%",
              "@media(max-width: 500px)": {
                paddingBottom: "17px",
              },
            }}
            label="Email"
            name="guestEmail"
            value={form.guestEmail}
            error={Boolean(incorrectFormatEmail)}
            onChange={handleChange}
          />

          <TextField
            InputLabelProps={{
              shrink: true,
              required: true,
              sx: {
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
                color: "#000",
              },
            }}
            InputProps={{
              style: {
                borderRadius: "15px",
              },
            }}
            sx={{
              width: "100%",
            }}
            label="Номер телефона"
            placeholder="+996"
            name="guestPhone"
            value={form.guestPhone}
            error={Boolean(incorrectFormatPhone)}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "17px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e5e2dc",
          width: "700px",
          padding: "2rem",
          borderRadius: "20px",
          marginBottom: "20px",
          "@media (max-width: 820px)": {
            padding: "1rem",
            width: "600px",
          },
          "@media (max-width: 720px)": {
            width: "100%",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            fontFamily: "Nunito, sans-serif",
            marginBottom: "17px",
            "@media(max-width: 517px)": {
              fontSize: "30px",
            },
            "@media(max-width: 408px)": {
              fontSize: "20px",
            },
          }}
        >
          3. Адрес Доставки
        </Typography>

        {form.deliveryMethod === 'Delivery' && (
        <TextField
          InputLabelProps={{
            shrink: true,
            required: true,
            sx: {
              "& .MuiFormLabel-asterisk": {
                display: "none",
              },
              color: "#000",
            },
          }}
          InputProps={{
            style: {
              borderRadius: "15px",
            },
          }}
          sx={{
            width: "100%",
          }}
          label="Адрес"
          placeholder="ул. Гоголя 127"
          name="address"
          value={form.address}
          error={Boolean(incorrectFormatAddress)}
          onChange={handleChange}
          required={form.deliveryMethod === 'Delivery'}
        />
        )}

        <TextField
          InputLabelProps={{
            shrink: true,
            required: true,
            sx: {
              "& .MuiFormLabel-asterisk": {
                display: "none",
              },
              color: "#000",
            },
          }}
          InputProps={{
            style: {
              borderRadius: "15px",
            },
          }}
          sx={{
            width: "100%",
          }}
          multiline
          rows={4}
          label="Пожелания к заказу"
          name="orderComment"
          value={form.orderComment}
          onChange={handleChange}
        />
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "17px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e5e2dc",
          width: "700px",
          padding: "2rem",
          borderRadius: "20px",
          marginBottom: "20px",
          "@media (max-width: 820px)": {
            padding: "1rem",
            width: "600px",
          },
          "@media (max-width: 720px)": {
            width: "100%",
          },
        }}
      >
        <Typography variant="h6">Способ оплаты</Typography>

        <Grid>
          <Button
            onClick={() => handlePaymentMethodChange(PaymentMethod.ByCash)}
            sx={{
              backgroundColor:
                form.paymentMethod === PaymentMethod.ByCash
                  ? "#5F8B4C"
                  : "transparent",
              color:
                form.paymentMethod === PaymentMethod.ByCash
                  ? "white"
                  : "#5F8B4C",
              border: "1px solid #5F8B4C",
              marginRight: "17px",
              "&:hover": {
                backgroundColor:
                  form.paymentMethod === PaymentMethod.ByCash
                    ? "#5F8B4C"
                    : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Наличными
          </Button>

          <Button
            onClick={() => handlePaymentMethodChange(PaymentMethod.ByCard)}
            sx={{
              backgroundColor:
                form.paymentMethod === PaymentMethod.ByCard
                  ? "#5F8B4C"
                  : "transparent",
              color:
                form.paymentMethod === PaymentMethod.ByCard
                  ? "white"
                  : "#5F8B4C",
              border: "1px solid #5F8B4C",
              "&:hover": {
                backgroundColor:
                  form.paymentMethod === PaymentMethod.ByCard
                    ? "#5F8B4C"
                    : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Картой
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "17px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e5e2dc",
          width: "700px",
          padding: "2rem",
          borderRadius: "20px",
          marginBottom: "20px",
          "@media (max-width: 820px)": {
            padding: "1rem",
            width: "600px",
          },
          "@media (max-width: 720px)": {
            width: "100%",
          },
        }}
      >
        <Typography variant="h6">Способ оплаты</Typography>

        <Grid>
          <Button
            onClick={() => handleDeliveryMethodChange(DeliveryMethod.PickUp)}
            sx={{
              backgroundColor:
                form.deliveryMethod === DeliveryMethod.PickUp
                  ? "#5F8B4C"
                  : "transparent",
              color:
                form.deliveryMethod === DeliveryMethod.PickUp
                  ? "white"
                  : "#5F8B4C",
              border: "1px solid #5F8B4C",
              marginRight: "17px",
              "&:hover": {
                backgroundColor:
                  form.deliveryMethod === DeliveryMethod.PickUp
                    ? "#5F8B4C"
                    : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Самовывоз
          </Button>

          <Button
            onClick={() => handleDeliveryMethodChange(DeliveryMethod.Delivery)}
            sx={{
              backgroundColor:
                form.deliveryMethod === DeliveryMethod.Delivery
                  ? "#5F8B4C"
                  : "transparent",
              color:
                form.deliveryMethod === DeliveryMethod.Delivery
                  ? "white"
                  : "#5F8B4C",
              border: "1px solid #5F8B4C",
              "&:hover": {
                backgroundColor:
                  form.deliveryMethod === DeliveryMethod.Delivery
                    ? "#5F8B4C"
                    : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Доставка
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "17px",
          display: "flex",
          justifyContent: "space-between",
          border: "1px solid #e5e2dc",
          width: "700px",
          padding: "2rem",
          borderRadius: "20px",
          marginBottom: "20px",
          "@media (max-width: 820px)": {
            padding: "1rem",
            width: "600px",
          },
          "@media (max-width: 720px)": {
            width: "100%",
          },
        }}
      >
        {carts.products && (
          <TotalPrice products={carts.products} bonusUsed={form.bonusUsed || 0} />
        )}

        <Grid
          container
          spacing={2}
          sx={{
            marginTop: "17px",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e5e2dc",
            width: "700px",
            padding: "2rem",
            borderRadius: "20px",
            marginBottom: "20px",
            "@media (max-width: 820px)": {
              padding: "1rem",
              width: "600px",
            },
            "@media (max-width: 720px)": {
              width: "100%",
            },
          }}
        >
          <Typography sx={{ fontSize: "20px" }}>Использовать бонусы:</Typography>

          <TextField
            label="Сколько бонусов использовать"
            type="number"
            value={form.bonusUsed}
            onChange={handleBonusChange}
            inputProps={{ min: 0, max: maxBonusesToUse }}
            sx={{ width: "100%" }}
            disabled={isBonusInputDisabled}
          />
        </Grid>
        <Typography sx={{ marginTop: 2 }}>
          Ваши бонусы: {availableBonuses} (Вы можете потратить до {maxBonusesToUse})
        </Typography>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#FF9900" }}
        >
          Оформить заказ
        </Button>
      </Grid>
    </form>
  );
};

export default OrderForm;