import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandsFromSlice } from '../../store/brands/brandsSlice.ts';
import { useEffect, useState } from 'react';
import { getBrands } from '../../store/brands/brandsThunk.ts';
import BrandForHomePage from '../../components/Domain/Brand/BrandForHomePage/BrandForHomePage.tsx';
import { Box, Container } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Carousel from '../../components/UI/Carousel/Carousel.tsx';
import CustomCart from '../../components/Domain/CustomCart/CustomCart.tsx';
import CategoryMenuBox from '../Category/CategoryMenuBox/CategoryMenuBox.tsx';
import CategoryCard from '../Category/CategoryCard/CategoryCard.tsx';

const HomePage = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const brands = useAppSelector(brandsFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands()).unwrap();
  }, [dispatch]);

  const closeCart = () => {
    setOpenCart(false);
  };

  return (
    <Container>
      <CustomCart openCart={openCart} closeCart={closeCart}/>

      <Box
        className="mb-5"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "stretch" },
          gap: 2,
          "@media (max-width: 990px)": { display: "flex",
            justifyContent: "row", },
        }}
      >
        <CategoryMenuBox />
        <Carousel />
      </Box>

      <Box className="mb-5">
        <CategoryCard/>
      </Box>

      {brands.length > 0 && (
        <Box sx={{ marginTop: "40px" }}>
          <Typography
            sx={{
              fontSize: "40px",
              mb: 0.5,
              color: "rgba(250, 143, 1, 1)",
              textAlign: "center",
            }}
          >
            Наши бренды
          </Typography>
          <BrandForHomePage brands={brands} />
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
