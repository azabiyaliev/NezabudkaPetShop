import { Box, Typography } from '@mui/joy';
import { ICartItem, ProductResponse } from '../../../../../../types';
import React from 'react';
import { apiUrl, userRoleClient } from '../../../../../../globalConstants.ts';
import IconButton from '@mui/joy/IconButton';
import { Add, Remove } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../../../app/hooks.ts';
import {
  cartFromSlice,
  deleteProductInCart,
  productCardToAdd,
  productCardToRemoveQuantity
} from '../../../../../../store/cart/cartSlice.ts';
import { deleteItemCart, fetchCart, updateCartItem } from '../../../../../../store/cart/cartThunk.ts';
import { selectUser } from '../../../../../../store/users/usersSlice.ts';
import { enqueueSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { COLORS, FONTS, SPACING } from '../../../../../../globalStyles/stylesObjects.ts';

interface Props {
  product: ICartItem;
  isFirst: boolean;
}

const Cart: React.FC<Props> = ({ product, isFirst }) => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const dispatch = useAppDispatch();

  const addQuantity = async (product: ProductResponse) => {
    if (user && (user.role === userRoleClient) && cart) {
      const existingProduct = cart.products.find((item) => item.product.id === product.id);
      if (existingProduct) {
        const amount = existingProduct.quantity + 1;
        await dispatch(updateCartItem({cartId: cart.id,  productId: product.id, quantity: amount})).unwrap();
        await dispatch(fetchCart()).unwrap();
      }
    } else {
      dispatch(productCardToAdd(product));
    }
  };

  const removeQuantity = async (product: ProductResponse) => {
    if (user && (user.role === userRoleClient) && cart) {
      const existingProduct = cart.products.find((item) => item.product.id === product.id);
      if (existingProduct && existingProduct.quantity > 1) {
        const amount = existingProduct.quantity - 1;
        await dispatch(updateCartItem({cartId: cart.id,  productId: product.id, quantity: amount})).unwrap();
        await dispatch(fetchCart()).unwrap();
      }
    } else {
      dispatch(productCardToRemoveQuantity(product));
    }
  };

  const deleteProductFromCart = async (id: number) => {
    if (user && (user.role === userRoleClient) && cart) {
      await dispatch(deleteItemCart({cartId: cart.id, productId: id})).unwrap();
      await dispatch(fetchCart()).unwrap();
    } else {
      dispatch(deleteProductInCart(id));
    }
    enqueueSnackbar("Данный товар удален из корзины!", {
      variant: "success",
    });
  };

  return (
    <Box>
      <Box
        sx={{
          margin: "10px 0",
          display: "flex",
          justifyContent: "space-between",
          borderTop: isFirst ? "none" : `1px solid ${COLORS.BORDER_CART}`,
          mr: SPACING.sm,
          pt: SPACING.sm,
          pp: SPACING.sm,
          '@media (max-width: 780px)': {
            flexWrap: "nowrap",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0,
            "@media (max-width: 1250px)": {
              alignItems: "start",
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              marginRight: SPACING.sm,
              display: "inline-block",
              "& img": {
                width: "100px",
                height: "110px",
                objectFit: "cover",
              },
              "@media (max-width: 450px)": {
                "& img": {
                  margin: '0 55%'
                },
              },
            }}
          >
            {product.product.sales && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  backgroundColor: COLORS.warning,
                  color: COLORS.white,
                  padding: `${SPACING.exs} ${SPACING.xs}`,
                  borderRadius: '5px',
                  fontWeight: FONTS.weight.bold,
                  fontSize: FONTS.size.sm,
                  transform: 'rotate(25deg)',
                  transformOrigin: 'top left',
                  zIndex: 10,
                  minWidth: '60px',
                  textAlign: 'center',
                  "@media (max-width: 450px)": {
                    top: 15,
                    right: 50,
                    left: 25,
                    transform: 'rotate(-35deg)',
                  },
                }}
              >
                -{product.product.promoPercentage}%
              </Box>
            )}
            <img
              src={apiUrl + product.product.productPhoto}
              alt={product.product.productName}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              '@media (max-width: 800px)': {
                width: '70%',
              },
              "@media (max-width: 450px)": {
                display: 'none',
              }
            }}
          >
            <Box>
              <Link
                to={`/product/${product.product.id}`}
                style={{
                  textDecoration: 'none',
                }}
              >
                <Typography
                  sx={{
                    fontSize: "lg",
                    mb: 0.5,
                    wordWrap: "break-word",
                    marginTop: '25px',
                    '&:hover': {
                      color: COLORS.primary,
                    },
                    "@media (max-width: 1250px)": {
                      marginTop: '25px',
                    },
                    "@media (max-width: 570px)": {
                      marginTop: '25px',
                      fontSize: "md",
                      textAlign: "center",
                    },
                  }}
                >
                  {product.product.productName}
                </Typography>
              </Link>
            </Box>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              "@media (max-width: 1250px)": {
                display: "none",
              },
              '@media (max-width: 950px)': {
                display: "flex",
              },
              "@media (max-width: 685px)": {
                display: "none",
              },
            }}>
              <Box
                sx={{
                  marginRight: "10px",
                }}
              >
                {product.product.sales ?
                  <>
                    <Typography
                      level="h3"
                      sx={{
                        fontSize: "lg",
                        mb: 0.5,
                        width: "110px",
                        textDecoration: 'line-through',
                        color: COLORS.text,
                      }}
                    >
                      {product.product.productPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
                    </Typography>
                    <Typography
                      level="h3"
                      sx={{
                        fontSize: "lg",
                        mb: 0.5,
                        width: "110px",
                        color: `${COLORS.yellow}`,
                      }}
                    >
                      {product.product.promoPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
                    </Typography>
                  </> :
                  <Typography
                    level="h3"
                    sx={{
                      fontSize: "lg",
                      mb: 0.5,
                      width: "110px",
                      color: `${COLORS.yellow}`,
                    }}
                  >
                    {product.product.productPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
                  </Typography>
                }
              </Box>
              <Box
                sx={{
                  width: "100px",
                  marginRight: SPACING.lg,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    pt: 2,
                    mb: 2,
                  }}
                >
                  <IconButton
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: product.quantity <= 1 ? "lightgray" : "rgb(112,168,71)",
                      border: "transparent",
                      "&:hover": {
                        backgroundColor: product.quantity <= 1 ? "lightgray" : "#237803",
                      },
                    }}
                    size="sm"
                    variant="outlined"
                    onClick={() => removeQuantity(product.product)}
                    disabled={product.quantity <= 1}
                  >
                    <Remove sx={{ color: "white" }} />
                  </IconButton>
                  <Typography
                    textColor="text.secondary"
                    sx={{ fontWeight: "md" }}
                  >
                    {product.quantity}
                  </Typography>
                  <IconButton
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "rgb(112,168,71)",
                      border: "transparent",
                      "&:hover": {
                        backgroundColor: "#237803",
                      },
                    }}
                    size="sm"
                    variant="outlined"
                    onClick={() => addQuantity(product.product)}
                  >
                    <Add sx={{ color: "white" }} />
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{
                  marginRight: "10px",
                }}
              >
                <Typography
                  level="h3"
                  sx={{
                    fontSize: "lg",
                    mb: 0.5,
                    width: "110px",
                    color: `${COLORS.yellow}`,
                  }}
                >
                  {product.product.sales
                    ? (product.product.promoPrice * product.quantity).toLocaleString('ru-RU').replace(/,/g, ' ')
                    : (product.product.productPrice * product.quantity).toLocaleString('ru-RU').replace(/,/g, ' ')} сом
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{
            display: 'none',
            "@media (max-width: 1250px)": {
              display: 'block',
            },
            '@media (max-width: 950px)': {
              display: "none",
            },
          }}>
            <IconButton
              sx={{
                marginRight: "5px",
              }}
              variant="plain"
              type="button"
              onClick={() => deleteProductFromCart(product.product.id)}
            >
              <svg
                style={{
                  fill: "#737373",
                  width: "15px",
                  height: "15px",
                }}
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
              </svg>
            </IconButton>
          </Box>
        </Box>
        <Box sx={{
          "@media (max-width: 1250px)": {
            display: 'none',
          },
          '@media (max-width: 950px)': {
            display: "block",
          },
        }}>
          <IconButton
            sx={{
              marginRight: "5px",
            }}
            variant="plain"
            type="button"
            onClick={() => deleteProductFromCart(product.product.id)}
          >
            <svg
              style={{
                fill: "#737373",
                width: "15px",
                height: "15px",
              }}
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
            </svg>
          </IconButton>
        </Box>
      </Box>

      <Box sx={{
        display: "none",
        alignItems: "center",
        justifyContent: 'space-around',
        '@media (max-width: 1250px)': {
          display: "flex",
        },
        '@media (max-width: 950px)': {
          display: "none",
        },
        "@media (max-width: 685px)": {
          display: "flex",
        },
        '@media (max-width: 450px)': {
          display: "none",
        },
      }}>
        <Box
          sx={{
            marginRight: "10px",
            "@media (max-width: 470px)": {
              marginRight: "5px",
            },
          }}
        >
          {product.product.sales ?
            <>
              <Typography
                level="h3"
                sx={{
                  fontSize: "lg",
                  mb: 0.5,
                  width: "110px",
                  textDecoration: 'line-through',
                  color: COLORS.text,
                }}
              >
                {product.product.productPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
              </Typography>
              <Typography
                level="h3"
                sx={{
                  fontSize: "lg",
                  mb: 0.5,
                  width: "110px",
                  color: `${COLORS.yellow}`,
                }}
              >
                {product.product.promoPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
              </Typography>
            </> :
            <Typography
              level="h3"
              sx={{
                fontSize: "lg",
                mb: 0.5,
                width: "110px",
                color: `${COLORS.yellow}`,
              }}
            >
              {product.product.productPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
            </Typography>
          }
        </Box>
        <Box
          sx={{
            width: "100px",
            marginRight: "5px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              pt: 2,
              mb: 2,
            }}
          >
            <IconButton
              sx={{
                borderRadius: "50%",
                backgroundColor: product.quantity <= 1 ? "lightgray" : "rgb(112,168,71)",
                border: "transparent",
                "&:hover": {
                  backgroundColor: product.quantity <= 1 ? "lightgray" : "#237803",
                },
              }}
              size="sm"
              variant="outlined"
              onClick={() => removeQuantity(product.product)}
              disabled={product.quantity <= 1}
            >
              <Remove sx={{ color: "white" }} />
            </IconButton>
            <Typography
              textColor="text.secondary"
              sx={{ fontWeight: "md", fontFamily: "Nunito, sans-serif" }}
            >
              {product.quantity}
            </Typography>
            <IconButton
              sx={{
                borderRadius: "50%",
                backgroundColor: "rgb(112,168,71)",
                border: "transparent",
                "&:hover": {
                  backgroundColor: "#237803",
                },
              }}
              size="sm"
              variant="outlined"
              onClick={() => addQuantity(product.product)}
            >
              <Add sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            marginRight: "10px",
          }}
        >
          <Typography
            level="h3"
            sx={{
              fontSize: "lg",
              mb: 0.5,
              width: "110px",
              color: `${COLORS.yellow}`,
            }}
          >
            {product.product.sales
              ? (product.product.promoPrice * product.quantity).toLocaleString('ru-RU').replace(/,/g, ' ')
              : (product.product.productPrice * product.quantity).toLocaleString('ru-RU').replace(/,/g, ' ')} сом
          </Typography>
        </Box>
      </Box>
      <Box sx={{
        display: "none",
        "@media (max-width: 450px)": {
          display: "block",
        },
      }}>
        <Box>
          <Link
            to={`/product/${product.product.id}`}
            style={{
              textDecoration: 'none',
            }}
          >
            <Typography
              sx={{
                fontSize: "md",
                mb: 1,
                mr: 0.5,
                wordWrap: "break-word",
                marginTop: '5px',
                textAlign: "center",
                '&:hover': {
                  color: COLORS.primary,
                },
              }}
            >
              {product.product.productName}
            </Typography>
          </Link>
        </Box>
        <Box
          sx={{
            textAlign: 'center'
          }}
        >
          {product.product.sales ?
            <>
              <Typography
                level="h3"
                sx={{
                  fontSize: "lg",
                  mb: 0.5,
                  textDecoration: 'line-through',
                  color: COLORS.text,
                }}
              >
                {product.product.productPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
              </Typography>
              <Typography
                level="h3"
                sx={{
                  fontSize: "lg",
                  mb: 0.5,
                  color: `${COLORS.yellow}`,
                }}
              >
                {product.product.promoPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
              </Typography>
            </> :
            <Typography
              level="h3"
              sx={{
                fontSize: "lg",
                mb: 0.5,
                color: `${COLORS.yellow}`,
              }}
            >
              {product.product.productPrice.toLocaleString('ru-RU').replace(/,/g, ' ')} сом
            </Typography>
          }
        </Box>
        <Box
          sx={{
            marginRight: "5px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              pt: 2,
              mb: 2,
            }}
          >
            <IconButton
              sx={{
                borderRadius: "50%",
                backgroundColor: product.quantity <= 1 ? "lightgray" : "rgb(112,168,71)",
                border: "transparent",
                "&:hover": {
                  backgroundColor: product.quantity <= 1 ? "lightgray" : "#237803",
                },
              }}
              size="sm"
              variant="outlined"
              onClick={() => removeQuantity(product.product)}
              disabled={product.quantity <= 1}
            >
              <Remove sx={{ color: "white" }} />
            </IconButton>
            <Typography
              textColor="text.secondary"
              sx={{ fontWeight: "md", fontFamily: "Nunito, sans-serif" }}
            >
              {product.quantity}
            </Typography>
            <IconButton
              sx={{
                borderRadius: "50%",
                backgroundColor: "rgb(112,168,71)",
                border: "transparent",
                "&:hover": {
                  backgroundColor: "#237803",
                },
              }}
              size="sm"
              variant="outlined"
              onClick={() => addQuantity(product.product)}
            >
              <Add sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            marginRight: "10px",
            textAlign: 'center',
          }}
        >
          <Typography
            level="h3"
            sx={{
              fontSize: "lg",
              mb: 0.5,
              color: `${COLORS.yellow}`,
            }}
          >
            {product.product.sales
              ? (product.product.promoPrice * product.quantity).toLocaleString('ru-RU').replace(/,/g, ' ')
              : (product.product.productPrice * product.quantity).toLocaleString('ru-RU').replace(/,/g, ' ')} сом
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
