import { useAppSelector } from '../../app/hooks.ts';
import { cartsFromSlice } from '../../features/cart/cartSlice.ts';
import Cart from '../../components/CustomCart/Cart.tsx';
import Typography from '@mui/joy/Typography';


const CartPage = () => {
  const cart = useAppSelector(cartsFromSlice);
  return (
    <>
      {cart.length > 0 ?  <Cart carts={cart}/> :
        <Typography
          level="h1"
          sx={{
            color: 'rgba(250, 179, 1, 1)',
          }}
        >Пока корзина пустая!</Typography>
      }
    </>
  );
};

export default CartPage;