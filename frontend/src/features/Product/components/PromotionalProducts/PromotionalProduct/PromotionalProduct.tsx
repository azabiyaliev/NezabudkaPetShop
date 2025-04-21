import { ProductResponse } from '../../../../../types';
import React from 'react';

interface Props {
  product: ProductResponse;
}

const PromotionalProduct:React.FC<Props> = ({product}) => {
  console.log(product);
  return (
    <>

    </>
  );
};

export default PromotionalProduct;