import { Box, Button, Typography } from '@mui/joy';
import { ICart, ProductResponse } from '../../../../../../types';
import React from 'react';
import { apiUrl } from '../../../../../../globalConstants.ts';
import IconButton from '@mui/joy/IconButton';
import { Add, Remove } from '@mui/icons-material';
import { useAppDispatch } from '../../../../../../app/hooks.ts';
import {
  deleteProduct,
  productCardToAdd,
  productCardToRemoveQuantity,
  setToLocalStorage
} from '../../../../../../store/cart/cartSlice.ts';
import { enqueueSnackbar } from 'notistack';

interface Props {
  product: ICart;
  products: ICart[];
}

const Cart:React.FC<Props> = ({product, products}) => {
  const dispatch = useAppDispatch();

  dispatch(setToLocalStorage(products));

  const addQuantity = (product: ProductResponse) => {
    dispatch(productCardToAdd(product));
    dispatch(setToLocalStorage(products));
  };

  const removeQuantity = async (product: ProductResponse) => {
    dispatch(productCardToRemoveQuantity(product));
  };

  const deleteProductFromCart = (id: number) => {
    dispatch(deleteProduct(id));
    dispatch(setToLocalStorage(products));
    enqueueSnackbar('Данный товар успешно удален из списка в корзине!', { variant: 'success' });
  };

  if (product.quantity === 0) {
    deleteProductFromCart(product.product.id);
  }

  return (
    <Box sx={{
      margin: '10px 0',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: '55%',
        p: 0
      }}>
        <Box sx={{marginRight: '25px'}}>
          <img
            style={{
              width: '80px',
              height: '90px',
              objectFit: 'cover'
            }}
            src={apiUrl + product.product.productPhoto}
            alt={product.product.productName}
          />
        </Box>
        <Box sx={{
          width: '100%',
        }}>
          <Typography
            level="h4"
            sx={{
              fontSize: 'lg',
              mb: 0.5,
              fontFamily: 'Nunito, sans-serif',
              wordWrap: 'break-word',
            }}>
            {product.product.productName}
          </Typography>
        </Box>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <Box sx={{
          marginRight: '10px',
        }}>
          <Typography
            level="h3"
            sx={{
              fontSize: 'lg',
              mb: 0.5,
              fontFamily: 'Nunito, sans-serif',
              width: '110px'
            }}>
            {(product.product.productPrice).toLocaleString()} сом
          </Typography>
        </Box>
        <Box sx={{
          width: '100px',
          marginRight: '5px'
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
              sx={{
                borderRadius: '50%',
                backgroundColor: 'rgb(112,168,71)',
                border: 'transparent',
                '&:hover': {
                  backgroundColor: '#237803',
                }
              }}
              size="sm"
              variant="outlined"
              onClick={() => removeQuantity(product.product)}
            >
              <Remove sx={{color: 'white'}}/>
            </IconButton>
            <Typography textColor="text.secondary" sx={{fontWeight: 'md', fontFamily: 'Nunito, sans-serif',}}>
              {product.quantity}
            </Typography>
            <IconButton
              sx={{
                borderRadius: '50%',
                backgroundColor: 'rgb(112,168,71)',
                border: 'transparent',
                '&:hover': {
                  backgroundColor: '#237803',
                }
              }}
              size="sm"
              variant="outlined"
              onClick={() => addQuantity(product.product)}
            >
              <Add sx={{color: 'white'}}/>
            </IconButton>
          </Box>
        </Box>
        <Box>
          <Button variant="plain" type='button'>
            <svg
              style={{
                fill:'#737373',
                width: '15px',
                height: '15px'
              }}
              xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
            </svg>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;