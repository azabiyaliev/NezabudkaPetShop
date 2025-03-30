import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import { ProductResponse } from "../../../types";
import { apiUrl } from "../../../globalConstants.ts";
import "../css/product.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { addCart, editCart, getCart } from "../../../store/cart/cartThunk.ts";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { cartsFromSlice } from "../../../store/cart/cartSlice.ts";

interface Props {
  product: ProductResponse;
}

const OneProductCard: React.FC<Props> = ({ product }) => {
  const cart = useAppSelector(cartsFromSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const addProductToCart = async (product: ProductResponse) => {
    const indexProduct = cart.findIndex(
      (order) => order.productId === product.id,
    );

    if (indexProduct === -1) {
      await dispatch(addCart({ productId: product.id, quantity: 1 })).unwrap();
      enqueueSnackbar("Данный товар успешно добавлен в корзину!", {
        variant: "success",
      });
    } else {
      const updatedProduct = {
        ...cart[indexProduct],
        quantity: cart[indexProduct].quantity + 1,
      };
      const cartId = cart[indexProduct].id;
      await dispatch(
        editCart({
          product: product,
          id: cartId,
          productId: updatedProduct.productId,
          quantity: updatedProduct.quantity,
        }),
      ).unwrap();
    }

    dispatch(getCart()).unwrap();
  };

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
