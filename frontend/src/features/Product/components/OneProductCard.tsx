import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ProductResponse } from "../../../types";
import { apiUrl } from "../../../globalConstants.ts";
import "../css/product.css";
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
      className="product-card"
      sx={{
        boxShadow: "none",
        borderRadius: 0,
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <CardMedia
        onClick={() => navigate(`/product/${product.id}`)}
        component="img"
        height="250"
        image={apiUrl + "/" + product.productPhoto}
        alt={product.productName}
        sx={{ objectFit: "contain", p: 2 }}
      />
      <CardContent>
        <Typography variant="body2">{product.productName}</Typography>
        <Typography
          variant="h6"
          color="orange"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
        >
          {product.productPrice.toLocaleString()} сом
          <Button onClick={toggleFavorite} sx={{ minWidth: 0, p: 0 }}>
            {isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon color="action" />
            )}
          </Button>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          💎 {product.productPrice.toLocaleString()} бонусов
        </Typography>
        <Button
          onClick={() => addProductToCart(product)}
          variant="contained"
          className="cart-button"
          disabled={isAddToCartDisabled}
          sx={{
            mt: "10px",
            backgroundColor: isAddToCartDisabled ? "#e0e0e0" : "#FFC107",
            color: isAddToCartDisabled ? "#9e9e9e" : "white",
            width: "100px",
            padding: "20px 0",
            borderRadius: 0,
            overflow: "hidden",
            position: "relative",
            fontSize: "12px",
          }}
        >
          <span className="cart-text">
            {isAddToCartDisabled ? "Нет в наличии" : "В корзину"}
          </span>
          <span className="cart-icon">
            <ShoppingCartIcon />
          </span>
        </Button>
        {cartItem && cartItem.quantity > 0 && (
          <Box sx={{
            marginTop: "10px"
          }}>
            <Typography variant="body2" color="textSecondary">
              В корзине: {cartItem ? cartItem.quantity : 0} шт.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OneProductCard;
