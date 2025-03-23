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
import { useNavigate } from 'react-router-dom';

interface Props {
  product: ProductResponse;
}

const OneProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  return (
    <Card
      className="product-card"
      sx={{
        boxShadow: "none",
        borderRadius: 0,
        textAlign: "center",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardMedia
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
