import {
  Button,
  Card,
  CardContent,
  CardMedia, Divider, IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from "react";
import { ProductResponse } from "../../../types";
import { apiUrl } from "../../../globalConstants.ts";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { addItem, fetchCart } from "../../../store/cart/cartThunk.ts";
import {
  cartFromSlice, newUserLogin,
  productCardToAdd,
  setToLocalStorage,
} from "../../../store/cart/cartSlice.ts";
import { enqueueSnackbar } from "notistack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { selectUser } from "../../../store/users/usersSlice.ts";
import {
  addFavoriteProduct,
  getLocalFavoriteProducts,
  isInLocalFavorites,
  removeFavoriteProduct,
} from "../../../store/favoriteProducts/favoriteProductLocal.ts";
import {
  addFavoriteProducts,
  removeFavoriteProductThunk,
} from "../../../store/favoriteProducts/favoriteProductsThunks.ts";
import { selectedFavorite } from "../../../store/favoriteProducts/favoriteProductsSlice.ts";
import { Box } from "@mui/joy";
import { motion, AnimatePresence } from "framer-motion";


interface Props {
  product: ProductResponse;
}

const OneProductCard: React.FC<Props> = ({ product }) => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const favorites = useAppSelector(selectedFavorite);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const isAddToCartDisabled = !product.existence;
  const cartItem = cart && cart.products.find((item) => item.productId === product.id);
  const [showAddAnimation, setShowAddAnimation] = useState(false);

  useEffect(() => {
    if (user) {
      const isOnServer = favorites.some((fav) => fav.product.id === product.id);
      setIsFavorite(isOnServer);
    } else {
      getLocalFavoriteProducts();
      setIsFavorite(isInLocalFavorites(product.id));
    }
  }, [user, product.id, favorites, dispatch]);

  const toggleFavorite = () => {
    const newValue = !isFavorite;
    setIsFavorite(newValue);

    if (!user) {
      if (newValue) {
        addFavoriteProduct(product.id);
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        removeFavoriteProduct(product.id);
        enqueueSnackbar("Удалено из избранного", { variant: "info" });
      }
    } else {
      if (newValue) {
        dispatch(addFavoriteProducts(product.id));
        enqueueSnackbar("Добавлено в избранное", { variant: "success" });
      } else {
        dispatch(removeFavoriteProductThunk(product.id));
        enqueueSnackbar("Удалено из избранного", { variant: "info" });
      }
    }
  };

  const addProductToCart = async (product: ProductResponse) => {
    setShowAddAnimation(true);

    setTimeout(() => {
      setShowAddAnimation(false);
    }, 1000);

    if (user && cart) {
      await dispatch(
        addItem({
          cartId: cart.id,
          productId: product.id,
          quantity: 1,
        }),
      ).unwrap();
      await dispatch(fetchCart()).unwrap();
    } else {
      if (!cart) {
        dispatch(newUserLogin());
        dispatch(productCardToAdd(product));
      } else {
        dispatch(productCardToAdd(product));
      }
    }

    const isFirstTimeAdded = cart?.products.some((item) => item.product.id === product.id);

    if (!isFirstTimeAdded) {
      enqueueSnackbar("Данный товар успешно добавлен в корзину!", { variant: "success" });
    }
  };

  useEffect(() => {
    dispatch(setToLocalStorage(cart));
  }, [dispatch, cart]);

  return (
    <Card
      sx={{
        maxWidth: 240,
        width: "100%",
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        borderRadius: 2,
        cursor: "pointer",
        position: 'relative',
        flex: '1 1 auto',
      }}
    >
      <Button onClick={toggleFavorite} sx={{ position: 'absolute', top: 4, right: -10  }}>
        {isFavorite ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon color="action" />
        )}
      </Button>
      <CardMedia
        onClick={() => navigate(`/product/${product.id}`)}
        component="img"
        height="250"
        image={apiUrl + "/" + product.productPhoto}
        alt={product.productName}
        sx={{ objectFit: "contain", p: 2 }}
      />
      <AnimatePresence initial={false}>
        {cartItem && cartItem.quantity > 0 && (
          <motion.div
            key="cart-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              left: 15,
              bottom: 10,
              width: "100%",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              В корзине: {cartItem.quantity} шт.
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
      <Divider sx={{ border: "2px solid gray" }}/>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography
          variant="body2"
          sx={{
          flexGrow: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          mb: 1,
          }}
        >{product.productName}</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {product.productWeight ? <Typography>
              {product.productWeight} кг
            </Typography> : null}
          <Typography
          >
            {product.productPrice.toLocaleString()} сом
          </Typography>
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => addProductToCart(product)}
              disabled={isAddToCartDisabled}
            >
              <ShoppingCartIcon />
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
                    top: -10,
                    right: 10,
                    backgroundColor: "#ffc107",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +1
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OneProductCard;
