import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { historyProduct, ICartBack } from '../../../types';
import { useParams } from 'react-router-dom';
import { selectProduct } from '../../../store/products/productsSlice.ts';
import React, { useEffect } from 'react';
import { getOneProduct } from '../../../store/products/productsThunk.ts';
import { addProductToHistory, historyProductsFromSlice } from '../../../store/historyProduct/historyProductSlice.ts';
import { Box } from '@mui/material';
import Typography from '@mui/joy/Typography';
import ProductCard from '../ProductCard/ProductCard.tsx';

interface Props {
  cart: ICartBack;
}

const HistoryProducts:React.FC<Props> = ({cart}) => {
  const viewedProducts = useAppSelector(historyProductsFromSlice);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const product = useAppSelector(selectProduct);

  useEffect(() => {
    dispatch(getOneProduct(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (id && product && product.id && product.productName) {
      dispatch(addProductToHistory({
        productId: product.id,
        product,
      }));
    }
  }, [dispatch, id, product]);

  const sortedProducts = [...viewedProducts].sort((a, b) => {
    if (a.product.existence === b.product.existence) return 0;
    return a.product.existence ? -1 : 1;
  });

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <Typography level="h2" gutterBottom sx={{
          mb:5,
          "@media (max-width: 625px)": {
            textAlign: 'center',
          },
        }}>
          История просмотров
        </Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
          "@media (max-width: 625px)": {
            justifyContent: 'center',
          },
        }}>
          {sortedProducts
            .filter((item): item is historyProduct => !!item.product && !!item.product.productName)
            .map((item) => (
              <ProductCard product={item.product} key={item.productId} cart={cart}/>
            ))}
        </Box>
      </Box>
    </div>
  );
};

export default HistoryProducts;