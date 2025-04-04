import { ICart } from "../../../types";
import React from "react";
import { Box, Button } from "@mui/material";
import { apiUrl } from "../../../globalConstants.ts";
import Typography from "@mui/joy/Typography";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useAppDispatch } from "../../../app/hooks.ts";
import { enqueueSnackbar } from "notistack";
import { deleteProduct } from "../../../store/cart/cartSlice.ts";

interface Props {
  productCart: ICart;
}
const CartProduct: React.FC<Props> = ({ productCart }) => {
  const dispatch = useAppDispatch();

  const deleteProductFromCart = (id: number) => {
    dispatch(deleteProduct(id));
    enqueueSnackbar("Данный товар успешно удален из корзины!", {
      variant: "success",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box>
        <img
          style={{
            width: "80px",
            height: "80px",
            objectFit: 'contain',
          }}
          src={apiUrl + productCart.product.productPhoto}
          alt={productCart.product.productName}
        />
      </Box>
      <Box sx={{ marginLeft: "20px" }}>
        <Typography sx={{ fontFamily: "Nunito, sans-serif" }}>
          {productCart.product.productName}
        </Typography>
        <Typography
          level="body-sm"
          sx={{ marginTop: "10px", fontFamily: "Nunito, sans-serif" }}
        >
          {productCart.quantity} x
          <span
            style={{
              color: "rgba(250, 179, 1, 1)",
              marginLeft: "5px",
            }}
          >
            <b>{productCart.product.productPrice} сом</b>
          </span>
        </Typography>
      </Box>
      <Box sx={{ ml: "auto" }}>
        <Button
          size="small"
          onClick={() => deleteProductFromCart(productCart.product.id)}
        >
          <ClearOutlinedIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default CartProduct;
