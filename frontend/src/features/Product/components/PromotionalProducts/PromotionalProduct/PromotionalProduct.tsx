import { Card, Typography } from '@mui/material';
import { ProductResponse } from '../../../../../types';
import React from 'react';
import { Box, styled } from '@mui/joy';
import { apiUrl } from '../../../../../globalConstants.ts';
import dayjs from 'dayjs';


interface Props {
  product: ProductResponse;
}

const DiscountBadge = styled("div")({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "#ccc",
  borderRadius: "50%",
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "red",
  fontWeight: "bold",
  fontSize: 14,
});

const PromotionalProduct:React.FC<Props> = ({product}) => {
  return (
    <>
      <Card
        sx={{
          width: 260,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          fontFamily: 'Arial, sans-serif',
          p: 1,
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ display: "flex", height: 120 }}>
          <Box
            sx={{
              width: "100px",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={apiUrl + product.brand.logo}
              alt={product.brand.title}
              style={{ maxHeight: "100px", objectFit: "contain" }}
            />
          </Box>
          <Box sx={{ width: "100px", position: "relative", p: 2 }}>
            <DiscountBadge>-10%</DiscountBadge>
            <img
              src={apiUrl + product.productPhoto}
              alt={product.productName}
              style={{ width: "100px", objectFit: "contain" }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            textAlign: "center",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Typography fontWeight={500} fontSize={14}>
            Корма {product.brand.title} скидка на 10%
          </Typography>
          <Typography fontSize={12} color="gray" mt={0.5}>
            С {dayjs(product.startDateSales).format("DD.MM.YYYY")} по{" "}
            {dayjs(product.endDateSales).format("DD.MM.YYYY")}
          </Typography>
        </Box>
      </Card>
    </>
  );
};

export default PromotionalProduct;