import React from 'react';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import ModalClose from '@mui/joy/ModalClose';
import Divider from '@mui/joy/Divider';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks.ts';
import { cartsFromSlice } from '../../../store/cart/cartSlice.ts';
import CartProduct from './CartProduct.tsx';
import imageCart from '../../../assets/image_transparent.png';

interface Props {
  openCart: boolean;
  closeCart: () => void;
}

const CustomCart:React.FC<Props> = ({openCart, closeCart}) => {
  const cart = useAppSelector(cartsFromSlice);
  const navigate = useNavigate();

  const backToShop = () => {
    closeCart();
    navigate("/all-products");
  };

  const makeOrder = () => {
    closeCart();
    navigate('/my_cart');
  };

  const checkProductInCart: { price: number; amount: number }[] = cart.map(
    (product) => {
      if (product.product) {
        return {
          price: product.product.productPrice,
          amount: product.quantity,
        };
      } else {
        return { price: 0, amount: 0 };
      }
    },
  );

  const sum: number = checkProductInCart.reduce(
    (acc: number, item: { price: number; amount: number }) => {
      return acc + item.price * item.amount;
    },
    0,
  );

  return (
    <React.Fragment>
      <Drawer
        anchor="right"
        size="md"
        variant="plain"
        open={openCart}
        onClose={closeCart}
        slotProps={{
          content: {
            sx: {
              bgcolor: "transparent",
              p: { md: 3, sm: 0 },
              boxShadow: "none",
            },
          },
        }}
      >
        <Sheet
          sx={{
            borderRadius: "md",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
            overflow: "auto",
          }}
        >
          {cart.length > 0 ?  <DialogTitle sx={{fontFamily: 'Nunito, sans-serif', fontWeight: 600}}>В корзине <b>{amount}</b>
            {amount === 1 ? 'товар' : (amount > 1 && amount < 5 ? 'товара' : 'товаров')}
          </DialogTitle>
          : <DialogTitle sx={{fontFamily: 'Nunito, sans-serif', fontWeight: 600}}>В корзине нет товаров</DialogTitle>}
          <ModalClose />
          <Divider/>
          {cart.length === 0 ? (
              <>
                <img
                  style={{
                    margin: '15% auto 0'
                  }}
                  width="150"
                  height="150"
                  src={imageCart} alt="shopping-cart"
                />
                <Typography level="h2" sx={{fontSize: 'xl', margin: '20px auto', fontFamily: 'Nunito, sans-serif', fontWeight: 600}}>
                  Корзина пуста!
                </Typography>
                <Button
                  type='button'
                  onClick={backToShop}
                  sx={{
                    backgroundColor: '#237803',
                    borderRadius: '50px',
                    fontFamily: 'Nunito, sans-serif',
                    color: 'white',
                    fontWeight: 600,
                    width: '200px',
                    margin: '0 auto',
                    padding: '15px 0',
                    fontSize: '16px',
                    '&:hover': {
                      backgroundColor: '#154902',
                    }
                  }}
                >
                  Вернуться в магазин
                </Button>
              </>
            ) :
            <>
              {cart.map((product, index) => (
                <React.Fragment key={product.product.id}>
                  <CartProduct productCart={product}/>
                  {index < cart.length - 1 && <Divider sx={{ mt: 'auto' }} />}
                </React.Fragment>
              ))}
              <Divider sx={{mt: 'auto'}}/>
              <Typography level="h2" sx={{fontFamily: 'Nunito, sans-serif', fontSize: 'xl', mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                Подытог:
                <span
                  style={{
                    color: "rgba(250, 179, 1, 1)",
                    marginLeft: "auto",
                    fontWeight: "bold",
                  }}
                >
                  {sum.toLocaleString()} сом
                </span>
              </Typography>
              <Button
                onClick={makeOrder}
                sx={{
                  backgroundColor: '#237803',
                  borderRadius: '50px',
                  fontFamily: 'Nunito, sans-serif',
                  color: 'white',
                  fontWeight: 600,
                  padding: '13px',
                  '&:hover': {
                    backgroundColor: '#154902',
                  }
                }}
              >
                Оформление заказа
              </Button>
            </>
          }
        </Sheet>
      </Drawer>
    </React.Fragment>
  );
};

export default CustomCart;
