import { ICart } from '../../../types';
import React from 'react';
import { Box, Button } from '@mui/material';
import { apiUrl } from '../../../globalConstants.ts';
import Typography from '@mui/joy/Typography';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useAppDispatch } from '../../../app/hooks.ts';
import { cartDelete, getCart } from '../../../store/cart/cartThunk.ts';
import { enqueueSnackbar } from 'notistack';

interface Props {
  productCart: ICart;
}
const CartProduct:React.FC<Props> = ({productCart}) => {
  const dispatch = useAppDispatch();

  const deleteProduct = async (id: number) => {
    await dispatch(cartDelete(id)).unwrap();
    enqueueSnackbar('Данный товар успешно удален из корзины!', { variant: 'success' });
    await dispatch(getCart()).unwrap();
  };

  return (
    <Box sx={{
      display: 'flex',
    }}>
      <Box>
        <img
          style={{
            width: '80px',
            height: '80px'
          }}
          src={apiUrl + productCart.product.productPhoto}
          alt={productCart.product.productName}
        />
      </Box>
      <Box sx={{marginLeft: '20px'}}>
        <Typography>
          {productCart.product.productName}
        </Typography>
        <Typography level="body-sm" sx={{marginTop: '10px'}}>
          {productCart.quantity} x
          <span style={{
            color: 'rgba(250, 179, 1, 1)',
            marginLeft: '5px',
          }}>
            <b>{productCart.product.productPrice} сом</b>
          </span>
        </Typography>
      </Box>
      <Box sx={{ ml: 'auto'}}>
        <Button size="small" onClick={() => deleteProduct(productCart.id)}>
          <ClearOutlinedIcon fontSize='small'/>
        </Button>
      </Box>
    </Box>
  );
};

export default CartProduct;