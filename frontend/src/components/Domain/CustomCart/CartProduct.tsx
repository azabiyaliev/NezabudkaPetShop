import { ICartItem } from '../../../types';
import React from 'react';
import { Box, Button } from '@mui/material';
import { apiUrl, userRoleClient } from '../../../globalConstants.ts';
import Typography from '@mui/joy/Typography';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { enqueueSnackbar } from 'notistack';
import { deleteItemCart, fetchCart } from '../../../store/cart/cartThunk.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { cartFromSlice, deleteProductInCart } from '../../../store/cart/cartSlice.ts';

interface Props {
  productCart: ICartItem;
}
const CartProduct: React.FC<Props> = ({ productCart }) => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const dispatch = useAppDispatch();

  const deleteProductFromCart = async (id: number) => {
    if (user && (user.role === userRoleClient) && cart) {
      await dispatch(deleteItemCart({cartId: cart.id, productId: id, token: user.token})).unwrap();
      await dispatch(fetchCart({ token: user.token })).unwrap();
    } else {
      dispatch(deleteProductInCart(id));
    }

    enqueueSnackbar("Данный товар успешно удален из корзины!", {
      variant: "success",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box>
        <img
          style={{
            width: "80px",
            height: "80px",
            objectFit: 'contain',
          }}
          src={apiUrl + productCart.product.productPhoto}
          alt={productCart.product.productName}
        />
      </Box>
      <Box sx={{ marginLeft: "20px" }}>
        <Typography sx={{ fontFamily: "Nunito, sans-serif" }}>
          {productCart.product.productName}
        </Typography>
        <Typography
          level="body-sm"
          sx={{ marginTop: "10px", fontFamily: "Nunito, sans-serif" }}
        >
          {productCart.quantity} x
          <span
            style={{
              color: "rgba(250, 179, 1, 1)",
              marginLeft: "5px",
            }}
          >
            <b>{productCart.product.productPrice} сом</b>
          </span>
        </Typography>
      </Box>
      <Box sx={{ ml: "auto" }}>
        <Button
          size="small"
          onClick={() => deleteProductFromCart(productCart.product.id)}
        >
          <ClearOutlinedIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default CartProduct;
