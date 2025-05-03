import { Box } from '@mui/joy';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { Container } from '@mui/material';
import image from '../../assets/image_transparent.png';
import Typography from '@mui/joy/Typography';
import OrderForm from '../Order/OrderForm.tsx';
import { cartFromSlice, setToLocalStorage } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { fetchCart } from '../../store/cart/cartThunk.ts';
import { useEffect } from 'react';
import { userRoleClient } from '../../globalConstants.ts';
import { NavLink } from 'react-router-dom';
import { COLORS, FONTS } from '../../globalStyles/stylesObjects.ts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    <Container maxWidth="xl"  sx={{ position: 'relative' }}>
      {cart && cart.products.length > 0 ? (
        <>
          <Typography
            level="h1"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: "25px",
              marginTop: "15px",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            Оформление заказа
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <OrderForm/>
            </Box>

          </Box>
        </>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            margin: "10% 0",
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-100px',
              left: '15px',
              display: 'flex',
              alignItems: 'center',
              "@media (max-width: 1420px)": {
                top: '-50px',
              },
              "@media (max-width: 770px)": {
                top: 1,
              },
            }}
          >
            <NavLink
              to={`/my_account/users/account/${user?.id}`}
              style={{
                textDecoration: "none",
                color: COLORS.success,
                fontSize: FONTS.size.lg,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowBackIcon sx={{ fontSize: FONTS.size.lg, marginRight: 1 }} />
              Назад
            </NavLink>
          </Box>

          <img width="200" height="200" src={image} alt="shopping-cart-emoji" />
          <Typography
            level="h1"
            sx={{
              marginTop: "10px",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 600,
            }}
          >
            Ваша корзина пуста!
          </Typography>
          <Typography
            sx={{
              marginTop: "20px",
              color: "#706e6a",
              fontFamily: "Nunito, sans-serif",
              fontSize: "18px",
            }}
          >
            Начните делать покупки и порадуйте своего питомца!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
