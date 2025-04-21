import { ProductResponse } from '../../../../types';
import React from 'react';
import { Box } from '@mui/joy';
import PromotionalProduct from './PromotionalProduct/PromotionalProduct.tsx';

interface Props {
  products: ProductResponse[];
}

const PromotionalProducts:React.FC<Props> = ({products}) => {
  return (
    <Box>
      {products.map((product) => (
        <PromotionalProduct key={product.id} product={product} />
      ))}
    </Box>
  );
};

export default PromotionalProducts;