import React from 'react';
import { ICartBack, ProductResponse } from '../../../../types';
import ProductCard from '../../../../components/Domain/ProductCard/ProductCard.tsx';
import { Box } from '@mui/material';

interface Props {
  products: ProductResponse[];
  cart: ICartBack;
}
const TopSellingProducts:React.FC<Props> = ({ products, cart }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 0',
      "@media (max-width: 666px)": {
        justifyContent: 'center',
      },
    }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} cart={cart} />
      ))}
    </Box>
  );
};

export default TopSellingProducts;