import OneBrand from '../../components/Domain/Brand/OneBrand/OneBrand.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandFromSlice } from '../../store/brands/brandsSlice.ts';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOneBrand } from '../../store/brands/brandsThunk.ts';
import { Container } from '@mui/material';
import { selectBrandProducts } from '../../store/products/productsSlice.ts';
import { getProductsByBrand } from '../../store/products/productsThunk.ts';
import { Typography } from '@mui/joy';
import { userRoleClient } from '../../globalConstants.ts';
import { fetchCart } from '../../store/cart/cartThunk.ts';
import { cartFromSlice, getFromLocalStorage } from '../../store/cart/cartSlice.ts';
import { selectUser } from '../../store/users/usersSlice.ts';

const BrandPage = () => {
  const brand = useAppSelector(brandFromSlice);
  const products = useAppSelector(selectBrandProducts);
  const cart = useAppSelector(cartFromSlice);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getOneBrand(Number(id))).unwrap();
      dispatch(getProductsByBrand(Number(id))).unwrap();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user && user.role === userRoleClient) {
      dispatch(fetchCart());
    } else {
      dispatch(getFromLocalStorage());
    }
  }, [dispatch, user]);

  const sortedProducts = [...products].sort((a, b) => {
    if (a.existence === b.existence) return 0;
    return a.existence ? -1 : 1;
  });

  return brand && (
    <Container maxWidth="xl">
      {cart && ( <OneBrand brand={brand} products={sortedProducts} cart={cart}/>)}
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
          У данного бренда пока нет товаров!
        </Typography>
      )}
    </Container>
  );
};

export default BrandPage;