import { Box } from '@mui/joy';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import image from '../../assets/image_transparent.webp';
import Typography from '@mui/joy/Typography';
import OrderForm from '../Order/OrderForm.tsx';
import { cartFromSlice, setToLocalStorage } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { fetchCart } from '../../store/cart/cartThunk.ts';
import { useEffect } from 'react';
import { userRoleClient } from '../../globalConstants.ts';
import { FONTS, SPACING } from '../../globalStyles/stylesObjects.ts';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Button from '@mui/joy/Button';

const CartPage = () => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    <Container maxWidth="xl">
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
              '@media (max-width: 420px)': {
                fontSize: '30px',
              },
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
          <Button
            onClick={() => navigate('/all-products')}
            sx={{
              backgroundColor: "#237803",
              borderRadius: "50px",
              color: "white",
              fontWeight: 600,
              padding: "13px",
              width: "250px",
              marginTop: '20px',
              "&:hover": {
                backgroundColor: "#154902",
              },
            }}
          >
            Каталог товаров
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
