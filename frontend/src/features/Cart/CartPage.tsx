import { Box } from '@mui/joy';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import Carts from '../../components/Domain/CustomCart/Basket/Carts/Carts.tsx';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/image_transparent.png';
import Typography from '@mui/joy/Typography';
import TotalPrice from '../../components/Domain/CustomCart/Basket/TotalPrice/TotalPrice.tsx';
import OrderForm from '../Order/OrderForm.tsx';
import { cartFromSlice, clearCart } from '../../store/cart/cartSlice.ts';
import { useEffect } from 'react';
import { fetchCart } from '../../store/cart/cartThunk.ts';
import { selectUser } from '../../store/users/usersSlice.ts';

const CartPage = () => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        dispatch(clearCart());
        await dispatch(fetchCart({ token: user.token })).unwrap();
      } else {
        dispatch(clearCart());
        const anonymousCartId = localStorage.getItem('anonymousCartId');
        if (anonymousCartId) {
          await dispatch(fetchCart({ anonymousCartId })).unwrap();
        }
      }
    };

    fetchData();
  }, [dispatch, user]);

  return (
    <Container>
      {cart && cart.products.length > 0 ? (
        <>
          <Typography
            level="h1"
            sx={{
              fontSize: "40px",
              margin: "20px 0",
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
              <Carts products={cart.products} />
              {
                <OrderForm/>
              }
            </Box>
            <TotalPrice products={cart.products} />
          </Box>
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
          <Button
            onClick={() => navigate("/all-products")}
            type="button"
            sx={{
              backgroundColor: "#237803",
              borderRadius: "50px",
              fontFamily: "Nunito, sans-serif",
              color: "white",
              fontWeight: 600,
              marginTop: "30px",
              "&:hover": {
                backgroundColor: "#154902",
              },
            }}
          >
            <span
              style={{
                padding: "10px 30px",
              }}
            >
              Вернуться в магазин
            </span>
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
