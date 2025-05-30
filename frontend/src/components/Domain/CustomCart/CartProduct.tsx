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
import { Link } from 'react-router-dom';
import { COLORS, FONTS } from '../../../globalStyles/stylesObjects.ts';

interface Props {
  productCart: ICartItem;
  closeCart: () => void;
}

const CartProduct: React.FC<Props> = ({ productCart, closeCart }) => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const dispatch = useAppDispatch();

  const deleteProductFromCart = async (id: number) => {
    if (user && user.role === userRoleClient && cart) {
      await dispatch(deleteItemCart({ cartId: cart.id, productId: id })).unwrap();
      await dispatch(fetchCart()).unwrap();
    } else {
      dispatch(deleteProductInCart(id));
    }

    enqueueSnackbar('Данный товар успешно удален из корзины!', {
      variant: 'success',
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginBottom: '5px',
          position: 'relative',
        }}
      >
        <Link
          to={`/product/${productCart.product.id}`}
          onClick={closeCart}
          style={{ display: 'block', width: '100%', height: '100%', backgroundColor: 'white' }}
        >
          {productCart.product.sales &&
            <Box sx={{
              position: 'absolute',
              top: -7,
              backgroundColor: COLORS.warning,
              color: COLORS.white,
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              fontWeight: FONTS.weight.bold,
              fontSize: '11px',
              cursor: 'pointer',
              zIndex: 2,
            }}>
              - {productCart.product.promoPercentage}%
            </Box>
          }
          <img
            src={apiUrl + productCart.product.productPhoto}
            alt={productCart.product.productName}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              margin: 'auto',
              backgroundColor: 'white'
            }}
          />
        </Link>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Link
          to={`/product/${productCart.product.id}`}
          onClick={closeCart}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Typography
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '&:hover': { color: COLORS.primary },
            }}
          >
            {productCart.product.productName}
          </Typography>
        </Link>
        {productCart.product.sales
          ? <Typography
            level="body-sm"
            sx={{ marginTop: '5px' }}
          >
            {productCart.quantity} x{' '}
            <span
              style={{
                color: COLORS.warning,
                marginLeft: '5px',
              }}
            >
            <b>{productCart.product.promoPrice.toLocaleString('ru-RU').replace(/,/g, ' ')}</b>
          </span> сом
          </Typography>
          : <Typography
            level="body-sm"
            sx={{ marginTop: '5px' }}
          >
            {productCart.quantity} x{' '}
            <span
              style={{
                color: 'rgba(250, 179, 1, 1)',
                marginLeft: '5px',
              }}
            >
            <b>{productCart.product.productPrice.toLocaleString('ru-RU').replace(/,/g, ' ')}</b>
          </span> сом
          </Typography>
        }
      </Box>

      <Box sx={{ ml: 1 }}>
        <Button size="small" onClick={() => deleteProductFromCart(productCart.product.id)}>
          <ClearOutlinedIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default CartProduct;
