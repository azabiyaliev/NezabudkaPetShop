import OneBrand from '../../components/Domain/Brand/OneBrand/OneBrand.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandFromSlice } from '../../store/brands/brandsSlice.ts';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOneBrand } from '../../store/brands/brandsThunk.ts';
import { Container } from '@mui/material';
import { selectProducts } from '../../store/products/productsSlice.ts';
import { getProductsByBrand } from '../../store/products/productsThunk.ts';

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
    </Container>
  );
};

export default BrandPage;