import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { getProducts } from '../../../features/products/productsThunk.ts';
import { selectProducts } from '../../../features/products/productsSlice.ts';
import OneProductCard from '../components/OneProductCard.tsx';

const AllProductsCardsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const [columns, setColumns] = useState(4);


  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Box sx={{ maxWidth: '1350px', margin: '0 auto', padding: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography fontWeight={500}>Отображение:</Typography>
        {[2, 3, 4, 5].map((num) => (
          <Box
            key={num}
            onClick={() => setColumns(num)}
            sx={{
              width: 24,
              height: 24,
              border: '1px solid #aaa',
              backgroundColor: columns === num ? '#000' : '#ccc',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
        className={`product-card-box columns-${columns}`}
      >
        {products.map((product) => (
          <Box
            key={product.id}
          >
            <OneProductCard product={product} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AllProductsCardsPage;
