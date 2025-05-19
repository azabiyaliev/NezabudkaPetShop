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
import CartProduct from './CartProduct.tsx';
import imageCart from '../../../assets/image_transparent.webp';
import { cartFromSlice } from '../../../store/cart/cartSlice.ts';
import { Box } from '@mui/material';
import { SPACING } from '../../../globalStyles/stylesObjects.ts';

interface Props {
  openCart: boolean;
  closeCart: () => void;
}

const CustomCart: React.FC<Props> = ({ openCart, closeCart }) => {
  const cart = useAppSelector(cartFromSlice);
  const navigate = useNavigate();

  const makeOrder = () => {
    closeCart();
    navigate("/my_cart");
  };

  const checkProductInCart: { price: number; amount: number }[] = Array.isArray(cart?.products)
    ? cart.products.map((product) => {
      if (product.product) {
        if (product.product.sales) {
          return {
            price: product.product.promoPrice,
            amount: product.quantity,
          };
        } else {
          return {
            price: product.product.productPrice,
            amount: product.quantity,
          };
        }
      } else {
        return { price: 0, amount: 0 };
      }
    })
    : [];

  const sum: number | null = checkProductInCart && checkProductInCart.reduce(
    (acc: number, item: { price: number; amount: number }) => {
      return acc + item.price * item.amount;
    },
    0,
  );

  const amount: number | null = checkProductInCart && checkProductInCart.reduce(
    (acc: number, item: { amount: number }) => {
      return acc + item.amount;
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
            height: "100%",
            backgroundColor: 'white',
          }}
        >
          <Box sx={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: 'white', pb: 2 }}>
            <Box sx={{ position: 'relative', pb: 1 }}>
              <DialogTitle sx={{ fontWeight: 600 }}>
                {cart && cart.products.length > 0 ? (
                  <>
                    В корзине <b>{amount}</b>{" "}
                    {amount === 1
                      ? "товар"
                      : amount && amount < 5
                        ? "товара"
                        : "товаров"}
                  </>
                ) : (
                  "В корзине нет товаров"
                )}
              </DialogTitle>
              <ModalClose  sx={{
                marginTop: '-15px'
              }}/>
            </Box>
            <Divider />
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {cart && cart.products.length === 0 || cart === null ? (
              <>
                <img
                  style={{ margin: "15% auto 0" }}
                  width="150"
                  height="150"
                  src={imageCart}
                  alt="shopping-cart"
                />
                <Typography
                  level="h2"
                  sx={{
                    fontSize: "xl",
                    margin: "20px auto",
                    fontWeight: 600,
                  }}
                >
                  Корзина пуста!
                </Typography>
              </>
            ) : (
              <>
                {Array.isArray(cart?.products) &&
                  cart.products.map((product, index) => (
                    <React.Fragment key={product.product.id}>
                      <CartProduct productCart={product} closeCart={closeCart} />
                      {index < cart.products.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
              </>
            )}
          </Box>

          {cart && cart.products.length > 0 && (
            <Box sx={{ pt: 2, borderTop: '1px solid #eee', marginTop: '10px' }}>
              <Typography
                level="h2"
                sx={{
                  fontSize: "xl",
                  mb: SPACING.xs,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Подытог:
                <span
                  style={{
                    color: "rgba(250, 179, 1, 1)",
                    marginLeft: "auto",
                    fontWeight: "bold",
                  }}
                >
                  {sum && sum.toLocaleString()} сом
                </span>
              </Typography>
              <Button
                onClick={makeOrder}
                sx={{
                  backgroundColor: "#237803",
                  borderRadius: "50px",
                  color: "white",
                  fontWeight: 600,
                  padding: "13px",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#154902",
                  },
                }}
              >
                Оформление заказа
              </Button>
            </Box>
          )}
        </Sheet>
      </Drawer>
    </React.Fragment>
  );
};

export default CustomCart;

