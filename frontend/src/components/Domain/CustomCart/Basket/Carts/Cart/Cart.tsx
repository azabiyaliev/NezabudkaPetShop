import { Box, Button, Typography } from '@mui/joy';
import { ICart, ProductResponse } from '../../../../../../types';
import React, { useEffect } from 'react';
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

  useEffect(() => {
    dispatch(setToLocalStorage(products));
  }, [dispatch, products]);

  const addQuantity = (product: ProductResponse) => {
    dispatch(productCardToAdd(product));
    dispatch(setToLocalStorage(products));
  };

  const removeQuantity = async (product: ProductResponse) => {
    dispatch(productCardToRemoveQuantity(product));
  };

  const deleteProductFromCart = (id: number) => {
    dispatch(deleteProduct(id));
    const updatedProducts = products.filter((product) => product.product.id !== id); // Фильтруем товары
    dispatch(setToLocalStorage(updatedProducts));
    enqueueSnackbar('Данный товар успешно удален из списка в корзине!', { variant: 'success' });
  };

  useEffect(() => {
    if (product.quantity === 0) {
      dispatch(deleteProduct(product.product.id));
      dispatch(setToLocalStorage(products));
    }
  }, [dispatch, product.product.id, product.quantity, products]);

  return (
    <Box sx={{
      margin: '10px 0',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      '@media (max-width: 825px)': {
        flexWrap: 'nowrap',
      },
      '@media (max-width: 720px)': {
        border: '1px solid #e4e4e4',
        borderRadius: '20px',
      },
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: '350px',
        p: 0,
        '@media (max-width: 850px)': {
         width: '300px',
        },
        '@media (max-width: 825px)': {
          marginRight: '10px',
        },
        '@media (max-width: 720px)': {
          width: '100%',
        },
        '@media (max-width: 570px)': {
          alignItems: 'start',
        },
      }}>
        <Box sx={{
          marginRight: '25px',
          display: 'inline-block',
          '& img': {
            width: '80px',
            height: '90px',
            objectFit: 'cover',
          },
          '@media (max-width: 720px)': {
            '& img': {
              borderTopLeftRadius: '20px',
              borderBottomLeftRadius: '20px',
            },
          },
          '@media (max-width: 570px)': {
            '& img': {
              width: '100px',
              height: '110px',
              margin: '20% 10px',
              borderRadius: '20px',
            },
            marginRight: '10px',
          },
        }}>
          <img
            src={apiUrl + product.product.productPhoto}
            alt={product.product.productName}
          />
        </Box>
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Typography
            level="h4"
            sx={{
              fontSize: 'lg',
              mb: 0.5,
              fontFamily: 'Nunito, sans-serif',
              wordWrap: 'break-word',
              '@media (max-width: 570px)': {
                mb: 0,
                mt: 1.5,
                fontSize: 'md',
                textAlign: 'center'
              },
            }}>
            {product.product.productName}
          </Typography>
          <Typography
            level="h3"
            sx={{
              fontSize: 'lg',
              mb: 0.5,
              fontFamily: 'Nunito, sans-serif',
              width: '110px',
              display: 'none',
              color: 'rgba(250, 179, 1, 1)',
              marginTop: '10px',
              '@media (max-width: 720px)': {
                display: 'block',
              },
              '@media (max-width: 570px)': {
                mb: 0,
                fontSize: 'md',
                textAlign: 'center',
                width: '100%',
              },
            }}>
            {(product.product.productPrice).toLocaleString()} сом
          </Typography>
          <Box sx={{
            width: '100px',
            marginRight: '5px',
            display: 'none',
            '@media (max-width: 570px)': {
              display: 'block',
              margin: '0 auto'
            },
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
                  },
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
        </Box>
        <Box sx={{
          display: 'none',
          '@media (max-width: 570px)': {
            display: 'block',
          },
        }}>
          <svg
            onClick={() => deleteProductFromCart(product.product.id)}
            style={{
              fill: '#737373',
              width: '15px',
              height: '15px',
              margin: '15px 0 0 10px',
              cursor: 'pointer',
            }}
            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
          </svg>
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
              width: '110px',
              '@media (max-width: 720px)': {
                display: 'none',
              },
            }}>
            {(product.product.productPrice).toLocaleString()} сом
          </Typography>
        </Box>
        <Box sx={{
          width: '100px',
          marginRight: '5px',
          '@media (max-width: 570px)': {
            display: 'none',
          },
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
                },
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
        <Box sx={{
          '@media (max-width: 570px)': {
            display: 'none',
          }
        }}>
          <Button
            sx={{
              marginRight: '5px',
            }}
            variant="plain"
            type='button'
            onClick={() => deleteProductFromCart(product.product.id)}
          >
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