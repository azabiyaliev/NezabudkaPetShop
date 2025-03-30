import { Box } from '@mui/joy';
import { useAppSelector } from '../../app/hooks.ts';
import Carts from '../../components/Domain/CustomCart/Basket/Carts/Carts.tsx';
import { cartsFromSlice } from '../../store/cart/cartSlice.ts';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/image_transparent.png';
import Typography from '@mui/joy/Typography';
import TotalPrice from '../../components/Domain/CustomCart/Basket/TotalPrice/TotalPrice.tsx';

const CartPage = () => {
  const cart = useAppSelector(cartsFromSlice);
  const navigate = useNavigate();

  return (
    <Container>
      {cart.length > 0 ?
        <>
          <Typography level="h1" sx={{ fontSize: '40px', margin: '20px 0', fontFamily: 'Nunito, sans-serif' }}>
            Оформление заказа
          </Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
            <Box>
              <Carts products={cart}/>
              {
               // Дальше нужно добавить компоненты для оформления заказа
              }
            </Box>
            <TotalPrice products={cart}/>
          </Box>
        </>
        :
        <Box sx={{
          textAlign: 'center',
          margin: '10% 0'
        }}>
          <img width="200" height="200" src={image}
               alt="shopping-cart-emoji"/>
          <Typography
            level="h1"
            sx={{
              marginTop: '10px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 600,
            }}
          >Ваша корзина пуста!
          </Typography>
          <Typography
            sx={{
              marginTop: '20px',
              color: '#706e6a',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '18px',
            }}
          >Начните делать покупки и порадуйте своего питомца!</Typography>
          <Button
            onClick={() => navigate('/all-products')}
            type='button'
            sx={{
              backgroundColor: '#237803',
              borderRadius: '50px',
              fontFamily: 'Nunito, sans-serif',
              color: 'white',
              fontWeight: 600,
              marginTop: '30px',
              '&:hover': {
                backgroundColor: '#154902',
              }
          }}><span style={{
            padding: '10px 30px'
          }}>Вернуться в магазин</span>
          </Button>
        </Box>
      }
    </Container>
  );
};

export default CartPage;