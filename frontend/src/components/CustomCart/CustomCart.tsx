import React from 'react';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import ModalClose from '@mui/joy/ModalClose';
import Divider from '@mui/joy/Divider';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks.ts';
import { cartsFromSlice } from '../../features/cart/cartSlice.ts';

interface Props {
  openCart: boolean;
  closeCart: () => void;
}

const CustomCart:React.FC<Props> = ({openCart, closeCart}) => {
  const cart = useAppSelector(cartsFromSlice);
  const navigate = useNavigate();

  const backToShop = () => {
    closeCart();
    navigate('/');
  }

  console.log(cart);

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
              bgcolor: 'transparent',
              p: { md: 3, sm: 0 },
              boxShadow: 'none',
            },
          },
        }}
      >
        <Sheet
          sx={{
            borderRadius: 'md',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <DialogTitle>Корзина</DialogTitle>
          <ModalClose />
          <Divider/>
          {cart.length === 0 ? (
              <>
                <img
                  style={{
                    margin: '20% auto 0'
                  }}
                  width="100"
                  height="100"
                  src="https://img.icons8.com/dotty/80/shopping-cart.png" alt="shopping-cart"
                />
                <Typography level="h2" sx={{fontSize: 'xl', margin: '20px auto'}}>
                  Корзина пуста!
                </Typography>
                <Button
                  onClick={backToShop}
                  sx={{
                    background: 'linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)',
                  }}
                >
                  Вернуться в магазин
                </Button>
              </>
            ) :
            <>
              <DialogContent sx={{gap: 2}}>

              </DialogContent>
              <Divider sx={{mt: 'auto'}}/>
              <Typography level="h2" sx={{fontSize: 'xl', mb: 0.5 }}>
                Подытог: 0 сом
              </Typography>
              <Button
                onClick={closeCart}
                sx={{
                  background: 'linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)',
                }}
              >
                Просмотр корзины
              </Button>
              <Button
                onClick={closeCart}
                sx={{
                  background: 'linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)',
                }}
              >
                Оформление заказа
              </Button>
            </>
          }

          {/*<Stack*/}
          {/*  direction="row"*/}
          {/*  useFlexGap*/}
          {/*  spacing={1}*/}
          {/*  sx={{ justifyContent: 'space-between' }}*/}
          {/*>*/}

          {/*</Stack>*/}
        </Sheet>
      </Drawer>
    </React.Fragment>
  );
};

export default CustomCart;