import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { Box } from '@mui/material';
import { apiUrl } from '../../../../globalConstants.ts';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import { Add, Remove } from '@mui/icons-material';
import React from 'react';
import { ICart } from '../../../../types';
import { useAppDispatch } from '../../../../app/hooks.ts';
import { cartDelete, editCart, getCart } from '../../../../features/cart/cartThunk.ts';
import { enqueueSnackbar } from 'notistack';

interface Props {
  productCart: ICart;
}

const Cart:React.FC<Props> = ({productCart}) => {
  const dispatch = useAppDispatch();

  const addQuantity = async (id: number) => {
    const amount = productCart.quantity + 1;
    await dispatch(editCart({id, productId: productCart.productId, quantity: amount, product: productCart.product})).unwrap();
    await dispatch(getCart()).unwrap();
  };

  const removeQuantity = async (id: number) => {
    if (productCart.quantity > 1) {
      const amount = productCart.quantity - 1;
      await dispatch(editCart({ id, productId: productCart.productId, quantity: amount, product: productCart.product })).unwrap();
      await dispatch(getCart()).unwrap();
    } else {
      enqueueSnackbar('Количество товара не может быть меньше 1! Если хотите убрать товар из списка, то можете удалить его из списка.', { variant: 'warning' });
    }
  };

  const deleteProduct = async (id: number) => {
    await dispatch(cartDelete(id)).unwrap();
    enqueueSnackbar('Данный товар успешно удален из списка в корзине!', { variant: 'success' });
    await dispatch(getCart()).unwrap();
  };

  const totalCost: number = productCart.product.productPrice * productCart.quantity;

  return (
    <tr>
      <td style={{
        fontSize: '15px'
      }}>
        <ClearOutlinedIcon fontSize="small" onClick={() => deleteProduct(productCart.id)}/>
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
            onClick={() => removeQuantity(productCart.id)}
          >
            <Remove/>
          </IconButton>
          <Typography textColor="text.secondary" sx={{fontWeight: 'md'}}>
            {productCart.quantity}
          </Typography>
          <IconButton
            size="sm"
            variant="outlined"
            onClick={() => addQuantity(productCart.id)}
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