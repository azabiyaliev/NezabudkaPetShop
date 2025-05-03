import { Box } from '@mui/joy';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import image from '../../assets/image_transparent.png';
import Typography from '@mui/joy/Typography';
import OrderForm from '../Order/OrderForm.tsx';
import { cartFromSlice, setToLocalStorage } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { fetchCart } from '../../store/cart/cartThunk.ts';
import { useEffect } from 'react';
import { userRoleClient } from '../../globalConstants.ts';
import { FONTS, SPACING } from '../../globalStyles/stylesObjects.ts';

const CartPage = () => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && (user.role === userRoleClient)) {
      dispatch(fetchCart()).unwrap();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) {
      dispatch(setToLocalStorage(cart));
    }
  }, [dispatch, cart, user]);

  return (
    <>
      {cart && cart.products.length > 0 ? (
        <>
          <Typography
            level="h1"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: FONTS.size.xxl,
              margin: SPACING.lg,
            }}
          >
            Оформление заказа
          </Typography>
          <OrderForm/>
        </>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            margin: "10% 0",
          }}
        >
          <img width="200" height="200" src={image} alt="shopping-cart-emoji" />
          <Typography
            level="h1"
            sx={{
              marginTop: "10px",
              fontWeight: 600,
            }}
          >
            Ваша корзина пуста!
          </Typography>
          <Typography
            sx={{
              marginTop: "20px",
              color: "#706e6a",
              fontSize: "18px",
            }}
          >
            Начните делать покупки и порадуйте своего питомца!
          </Typography>
        </Box>
      )}
    </>
  );
};

export default CartPage;
