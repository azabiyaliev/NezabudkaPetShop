import { Badge, Box, Card, CardMedia, IconButton, Typography } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { apiUrl, userRoleAdmin, userRoleClient, userRoleSuperAdmin } from '../../../globalConstants.ts';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { ProductResponse } from '../../../types';
import React, { useEffect, useState } from 'react';
import { addItem, fetchCart } from '../../../store/cart/cartThunk.ts';
import { cartFromSlice, newUserLogin, productCardToAdd, setToLocalStorage } from '../../../store/cart/cartSlice.ts';
import { enqueueSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import {
  addFavoriteProduct,
  getLocalFavoriteProducts,
  removeFavoriteProduct
} from '../../../store/favoriteProducts/favoriteProductLocal.ts';
import {
  addFavoriteProducts,
  getFavoriteProducts,
  removeFavoriteProductThunk
} from '../../../store/favoriteProducts/favoriteProductsThunks.ts';
import { selectedFavorite } from '../../../store/favoriteProducts/favoriteProductsSlice.ts';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AnimatePresence, motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { COLORS, FONTS, SPACING } from '../../../globalStyles/stylesObjects.ts';
import { Tooltip } from '@mui/joy';
import dayjs from 'dayjs';

interface Props {
  product: ProductResponse;
}

const ProductCard:React.FC<Props> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showAddAnimation, setShowAddAnimation] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const favoriteProduct = useAppSelector(selectedFavorite);
  const dispatch = useAppDispatch();

  const toggleFavorite = (id: number) => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    if (!user) {
      if (newValue) {
        addFavoriteProduct(id);
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        removeFavoriteProduct(id);
        enqueueSnackbar("Удалено из избранного", { variant: "info" });
      }
    } else {
      if (newValue) {
        dispatch(addFavoriteProducts(id));
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        dispatch(removeFavoriteProductThunk(id));
        enqueueSnackbar("Удалено из избранного", { variant: "info" });
      }
    }
  };

  const addItemToCart = async (productItem: ProductResponse) => {
    setShowAddAnimation(true);

    setTimeout(() => {
      setShowAddAnimation(false);
    }, 1000);

    if (user && (user.role === userRoleClient) && cart) {
      await dispatch(
        addItem({
          cartId: cart.id,
          productId: productItem.id,
          quantity: 1,
        }),
      ).unwrap();
      await dispatch(fetchCart()).unwrap();
    } else {
      if (!cart) {
        dispatch(newUserLogin());
        dispatch(productCardToAdd(productItem));
      } else {
        dispatch(productCardToAdd(productItem));
      }
    }

    const isFirstTimeAdded = cart?.products.some((item) => item.product.id === productItem.id);

    if (!isFirstTimeAdded) {
      enqueueSnackbar("Данный товар успешно добавлен в корзину!", { variant: "success" });
    }
  };

  useEffect(() => {
    dispatch(setToLocalStorage(cart));

    if (user) {
      dispatch(getFavoriteProducts());
    }
  }, [dispatch, cart, user]);

  const cartItem = cart?.products.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const isProductFavorite = user
    ? favoriteProduct.some((fav) => fav.id === product.id)
    : getLocalFavoriteProducts().some((fav) => fav === product.id);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        width: 233,
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        position: 'relative',
        margin: `0 ${SPACING.xs} ${SPACING.sm}`,
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
          transition: 'transform 0.3s, box-shadow 0.3s',
        },
      }}
    >
      {product.sales && (
        <Tooltip title={`С ${dayjs(product.startDateSales).format("DD.MM.YYYY")} по 
        ${dayjs(product.endDateSales).format("DD.MM.YYYY")}`} sx={{color: COLORS.white, backgroundColor: COLORS.info}} variant='outlined'
                 placement="top-start">
          <Box sx={{
            position: 'absolute',
            top: 15,
            left: 8,
            backgroundColor: COLORS.warning,
            color: COLORS.white,
            padding: `${SPACING.exs} ${SPACING.xs}`,
            borderRadius: '5px',
            fontWeight: FONTS.weight.bold,
            fontSize: FONTS.size.sm,
            cursor: 'pointer'
          }}>
            - {product.promoPercentage}%
          </Box>
        </Tooltip>
      )}

      <Box sx={{position: 'absolute', top: 8, right: 8}}>
        {isProductFavorite ?
          <IconButton onClick={() => toggleFavorite(product.id)}>
            <FavoriteIcon color="error"/>
          </IconButton>
          :
          <IconButton onClick={() => toggleFavorite(product.id)}>
            <FavoriteBorderOutlinedIcon/>
          </IconButton>
        }
      </Box>

      <a
        href={`/product/${product.id}`}
        rel="noopener noreferrer"
        style={{textDecoration: 'none'}}
      >
        <CardMedia
          component="img"
          image={apiUrl + '/' + product.productPhoto}
          alt={product.productName}
          sx={{
            width: "100%",
            maxHeight: '150px',
            objectFit: 'contain',
            mb: 1,
            cursor: 'pointer',
          }}
        />
      </a>
        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, borderTop: '1px solid lightgrey', mt: 1.5}}>
            <a
              href={`/product/${product.id}`}
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                margin: SPACING.xs,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  flexGrow: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  mb: 1,
                  fontSize: FONTS.size.sm,
                }}
              >{product.productName}</Typography>
            </a>

          <Box
            sx={{
              mt: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
            }}
          >
            <Box>
              <Typography
                sx={{
                  visibility: product.productWeight ? 'visible' : 'hidden',
                  minWidth: '40px',
                  marginLeft: '10px'
                }}
              >
                {product.productWeight} кг
              </Typography>
            </Box>
            <Box>
              {product.sales ? (
                <>
                  <Typography fontWeight={600} sx={{
                    textDecoration: 'line-through',
                    color: COLORS.text,
                  }}>
                    {product.productPrice} сом
                  </Typography>
                  <Typography fontWeight={600} sx={{color: COLORS.warning}}>
                    {product.promoPrice} сом
                  </Typography>
                </>

              ) : (
                <Typography fontWeight={600}>
                  {product.productPrice} сом
                </Typography>
              )}
            </Box>
            <Box sx={{ position: "relative", mb: '-5px' }}>
              {(!product.existence || (user && (user.role === userRoleAdmin || user.role === userRoleSuperAdmin))) ? (
                <Tooltip
                  title={
                    !product.existence
                      ? "Нет в наличии"
                      : "Вы не можете добавлять товар в корзину"
                  }
                  placement="bottom-start"
                  variant="plain"
                  sx={{color: COLORS.white, backgroundColor: COLORS.yellow}}
                >
                  <span>
                    <IconButton disabled>
                      <ShoppingCartIcon sx={{ color: 'grey.400' }} />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <IconButton onClick={() => addItemToCart(product)}>
                  {quantityInCart > 0 ? (
                    <Badge
                      badgeContent={quantityInCart}
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: COLORS.info,
                          color: COLORS.background,
                        },
                      }}
                    >
                      <ShoppingCartOutlinedIcon />
                    </Badge>
                  ) : (
                    <ShoppingCartOutlinedIcon />
                  )}
                </IconButton>
              )}

              <AnimatePresence>
                {showAddAnimation && (
                  <motion.div
                    initial={{ y: -20, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: "absolute",
                      top: -12,
                      right: 10,
                      backgroundColor: "#ffc107",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 30,
                      height: 30,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                      pointerEvents: 'none',
                    }}
                  >
                    +1
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </Box>
    </Card>
);
};

export default ProductCard;