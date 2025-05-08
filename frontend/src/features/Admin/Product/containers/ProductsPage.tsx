import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { getProducts } from '../../../../store/products/productsThunk.ts';
import { selectProducts } from '../../../../store/products/productsSlice.ts';
import AdminBar from '../../AdminProfile/AdminBar.tsx';
import Typography from '@mui/joy/Typography';
import { Box } from '@mui/material';
import { SPACING } from '../../../../globalStyles/stylesObjects.ts';
import Products from '../components/Products.tsx';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);

  useEffect(() => {
    dispatch(getProducts(''));
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex", margin: "30px 0",
      "@media (max-width: 1300px)": {
        flexDirection: "column",
      },
    }}>
      <Box sx={{
        minWidth: 240,
        "@media (max-width: 1300px)": {
          width: "100%",
          minWidth: "100%",
        },}}>
        <AdminBar />
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        {products.length > 0 ? (
          <Box sx={{ width: "90%", maxWidth: 950, mt: SPACING.md }}>
            <Products products={products}/>
          </Box>
        ) : (
          <Typography level="h2" sx={{ fontSize: 'xl', mb: 0.5 }}>
            Пока нет товаров!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductsPage;
