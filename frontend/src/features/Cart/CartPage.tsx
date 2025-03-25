import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { cartsFromSlice } from '../../store/cart/cartSlice.ts';
import Carts from '../../components/Domain/CustomCart/Carts/Carts.tsx';
import Typography from '@mui/joy/Typography';
import { useEffect } from 'react';
import { getCart } from '../../store/cart/cartThunk.ts';
import { Box } from '@mui/joy';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
  const cart = useAppSelector(cartsFromSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCart()).unwrap();
  }, [dispatch]);

  return (
    <Container>
      {cart.length > 0 ?
      <Box>
        <Carts carts={cart}/>
        <Box sx={{textAlign: 'end'}}>
          <Button
            onClick={() => navigate('/my_order')}
            variant="text"
            sx={{
              padding: '10px 20px',
              color: 'white',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)',
            }}
            type="button"
          >
            Оформить заказ
          </Button>
        </Box>
      </Box>
        :
        <Box sx={{
          textAlign: 'center',
          margin: '10% 0'
        }}>
          <img width="100" height="100" src="https://img.icons8.com/emoji/100/shopping-cart-emoji.png"
               alt="shopping-cart-emoji"/>
          <Typography
            level="h1"
            sx={{
              color: 'rgba(250, 179, 1, 1)',
              marginTop: '10px'
            }}
          >Корзина пока пустая!</Typography>
        </Box>
      }
    </Container>
  );
};

export default CartPage;