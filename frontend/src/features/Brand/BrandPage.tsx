import OneBrand from '../../components/Domain/Brand/OneBrand/OneBrand.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandFromSlice } from '../../store/brands/brandsSlice.ts';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOneBrand } from '../../store/brands/brandsThunk.ts';
import { Container } from '@mui/material';
import { selectProducts } from '../../store/products/productsSlice.ts';
import { getProductsByBrand } from '../../store/products/productsThunk.ts';
import { Typography } from '@mui/joy';

const BrandPage = () => {
  const brand = useAppSelector(brandFromSlice);
  const products = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getOneBrand(Number(id))).unwrap();
      dispatch(getProductsByBrand(Number(id))).unwrap();
    }
  }, [dispatch, id]);

  return brand && (
    <Container>
      <OneBrand brand={brand} products={products}/>
      {products.length === 0 && (
        <Typography
          level="h2"
          sx={{
            fontFamily: "Nunito, sans-serif",
            color: "#237803",
            fontSize: '30px',
            margin: '30px 0',
            "@media (max-width: 830px)": {
              textAlign: "center",
            },
            "@media (max-width: 650px)": {
              fontSize: '25px',
            },
          }}
        >
          У данного бренда нет товаров!
        </Typography>
      )}
    </Container>
  );
};

export default BrandPage;