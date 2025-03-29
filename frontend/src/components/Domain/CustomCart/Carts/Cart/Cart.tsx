import { Box } from '@mui/material';
import { apiUrl } from '../../../../../globalConstants.ts';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import { Add, Remove } from '@mui/icons-material';
import React from 'react';
import { ICart, ProductResponse } from '../../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks.ts';
import {
  cartsFromSlice,
  deleteProduct,
  productCardToAdd,
  productCardToRemoveQuantity, setToLocalStorage
} from '../../../../../store/cart/cartSlice.ts';
import { enqueueSnackbar } from 'notistack';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

interface Props {
  productCart: ICart;
}

const Cart:React.FC<Props> = ({productCart}) => {
  const cart = useAppSelector(cartsFromSlice);
  const dispatch = useAppDispatch();

  dispatch(setToLocalStorage(cart));

  const addQuantity = (product: ProductResponse) => {
    dispatch(productCardToAdd(product));
    dispatch(setToLocalStorage(cart));
  };

  const removeQuantity = async (product: ProductResponse) => {
    dispatch(productCardToRemoveQuantity(product));
  };

  const deleteProductFromCart = (id: number) => {
    dispatch(deleteProduct(id));
    dispatch(setToLocalStorage(cart));
    enqueueSnackbar('Данный товар успешно удален из списка в корзине!', { variant: 'success' });
  };

  const totalCost: number = productCart.product.productPrice * productCart.quantity;

  return (
    <tr>
      <td style={{
        fontSize: '15px'
      }}>
        <ClearOutlinedIcon fontSize="small" onClick={() => deleteProductFromCart(productCart.product.id)}/>
      </td>
      <td>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <Box>
            <img
              style={{
                width: '70px',
                height: '80px',
                borderRadius: '10px'
              }}
              src={apiUrl + productCart.product.productPhoto}
              alt={productCart.product.productName}
            />
          </Box>
          <Box sx={{marginLeft: '20px'}}>
            <Typography>
              {productCart.product.productName}
            </Typography>
          </Box>
        </Box>
      </td>
      <td style={{
        fontSize: '18px'
      }}>
        <Typography level="body-sm">
          {productCart.product.productPrice.toLocaleString()} сом
        </Typography>
      </td>
      <td style={{
        textAlign: 'center'
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            pt: 2,
            mb: 2,
          }}
        >
          <IconButton
            size="sm"
            variant="outlined"
            onClick={() => removeQuantity(productCart.product)}
          >
            <Remove/>
          </IconButton>
          <Typography textColor="text.secondary" sx={{fontWeight: 'md'}}>
            {productCart.quantity}
          </Typography>
          <IconButton
            size="sm"
            variant="outlined"
            onClick={() => addQuantity(productCart.product)}
          >
            <Add/>
          </IconButton>
        </Box>
      </td>
      <td>
        <Typography level="h2" sx={{fontSize: 'md', color: 'rgba(250, 179, 1, 1)'}}>
          {totalCost.toLocaleString()} сом
        </Typography>
      </td>
    </tr>
  );
};

export default Cart;