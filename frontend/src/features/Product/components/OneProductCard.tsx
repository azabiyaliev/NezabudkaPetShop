import { Button, Card, CardContent, CardMedia, Typography, } from '@mui/material';
import React, { useEffect } from 'react';
import { ProductResponse } from '../../../types';
import { apiUrl } from '../../../globalConstants.ts';
import '../css/product.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { addItem, fetchCart } from '../../../store/cart/cartThunk.ts';
import {
  cartFromSlice,
  clearCart,
  newUserLogin,
  productCardToAdd,
  setToLocalStorage
} from '../../../store/cart/cartSlice.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';

interface Props {
  product: ProductResponse;
}

const OneProductCard: React.FC<Props> = ({ product }) => {
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(clearCart());
      dispatch(fetchCart({ token: user.token })).unwrap();
    }
  }, [dispatch, user]);

  const addProductToCart = async (product: ProductResponse) => {
    if (user && cart) {
      await dispatch(addItem({
        cartId: cart.id,
        productId: product.id,
        quantity: 1,
        token: user.token,
      })).unwrap();
      await dispatch(fetchCart({ token: user.token })).unwrap();
    } else {
      dispatch(productCardToAdd(product));
    }
  };

  useEffect(() => {
    dispatch(setToLocalStorage(cart));
  }, [dispatch, cart]);

  useEffect(() => {
    dispatch(newUserLogin());
  }, [dispatch]);

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
        <Typography variant="h6" color="orange">
          {product.productPrice.toLocaleString()} сом
        </Typography>
        <Typography variant="body2" color="textSecondary">
          до 500 Бонусов
        </Typography>
        <Button
          onClick={() => addProductToCart(product)}
          variant="contained"
          className="cart-button"
          sx={{
            mt: "10px",
            backgroundColor: "#FFC107",
            color: "white",
            width: "100px",
            padding: "20px 0",
            borderRadius: 0,
            overflow: "hidden",
            position: "relative",
            fontSize: "12px",
          }}
        >
          <span className="cart-text">В корзину</span>
          <span className="cart-icon">
            <ShoppingCartIcon />
          </span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default OneProductCard;
