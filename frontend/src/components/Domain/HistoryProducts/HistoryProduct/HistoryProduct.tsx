import { Badge, Box, Card, CardMedia, IconButton } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { apiUrl } from '../../../../globalConstants.ts';
import Typography from '@mui/joy/Typography';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { historyProduct, ProductResponse } from '../../../../types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addItem, fetchCart } from '../../../../store/cart/cartThunk.ts';
import { cartFromSlice, newUserLogin, productCardToAdd, setToLocalStorage } from '../../../../store/cart/cartSlice.ts';
import { enqueueSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { selectUser } from '../../../../store/users/usersSlice.ts';
import {
  addFavoriteProduct,
  getLocalFavoriteProducts,
  removeFavoriteProduct
} from '../../../../store/favoriteProducts/favoriteProductLocal.ts';
import {
  addFavoriteProducts,
  getFavoriteProducts,
  removeFavoriteProductThunk
} from '../../../../store/favoriteProducts/favoriteProductsThunks.ts';
import { selectedFavorite } from '../../../../store/favoriteProducts/favoriteProductsSlice.ts';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AnimatePresence, motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { COLORS, FONTS, SPACING } from '../../../../globalStyles/stylesObjects.ts';

interface Props {
  item: historyProduct;
}

const HistoryProduct:React.FC<Props> = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showAddAnimation, setShowAddAnimation] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const favoriteProduct = useAppSelector(selectedFavorite);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

    if (user && cart) {
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

  const cartItem = cart?.products.find((product) => product.product.id === item.product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const isProductFavorite = user
    ? favoriteProduct.some((fav) => fav.id === item.product.id)
    : getLocalFavoriteProducts().some((fav) => fav === item.product.id);

  return (
    <Card
      key={item.productId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        width: 233,
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
          transition: 'transform 0.3s, box-shadow 0.3s',
        },
      }}
    >
      {item.product.sales && (
        <Box sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: 'red',
          color: COLORS.white,
          padding: SPACING.xs,
          borderRadius: '5px',
          fontWeight: FONTS.weight.bold,
          fontSize: FONTS.size.sm,
        }}>
          - {item.product.promoPercentage}%
        </Box>
      )}

      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        {isProductFavorite ?
          <FavoriteIcon color="error" onClick={() => toggleFavorite(item.productId)} />
          :
          <FavoriteBorderOutlinedIcon
            onClick={() => toggleFavorite(item.productId)}
            sx={{cursor: 'pointer'}}
          />
        }
      </Box>

      <CardMedia
        onClick={() => navigate(`/product/${item.productId}`)}
        component="img"
        image={apiUrl + '/' + item.product.productPhoto}
        alt={item.product.productName}
        sx={{
          width: "100%",
          height: 150,
          objectFit: 'contain',
          mb: 1,
          cursor: 'pointer',
        }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, borderTop: '1px solid lightgrey', mt: 1.5 }}>
        <Box
          onClick={() => navigate(`/product/${item.productId}`)}
          sx={{ cursor: 'pointer', margin: '10px' }}
        >
          <Typography level="h4" sx={{ fontSize: 'lg' }}>
            {item.product.brand.title}
          </Typography>
          <Typography level="body-md" sx={{ marginTop: '10px' }}>
            {item.product.productName}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            pt: 1.5,
            border: '1px solid red'
          }}
        >
          <Box>
            <Typography
              sx={{
                visibility: item.product.productWeight ? 'visible' : 'hidden',
                minWidth: '40px',
                marginLeft: '10px'
              }}
            >
              {item.product.productWeight} кг
            </Typography>
          </Box>
          <Box>
            {item.product.sales ? (
              <>
                <Typography fontWeight={600} sx={{
                  textDecoration: 'line-through',
                  color: COLORS.text,
                }}>
                  {item.product.productPrice} сом
                </Typography>
                <Typography fontWeight={600} sx={{color: COLORS.warning}}>
                  {item.product.promoPrice} сом
                </Typography>
              </>

            ) : (
              <Typography fontWeight={600}>
                {item.product.productPrice} сом
              </Typography>
            )}
          </Box>
          <Box sx={{ position: "relative"}}>
            <IconButton
              onClick={() => addItemToCart(item.product)}
              disabled={!item.product.existence}
            >
              {item.product.existence ?
                <>
                  {quantityInCart > 0 ?
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
                    </Badge> : <ShoppingCartOutlinedIcon />
                  }
                </> : <ShoppingCartIcon />
              }
            </IconButton>
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

export default HistoryProduct;