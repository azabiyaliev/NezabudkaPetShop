import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandsFromSlice } from '../../features/brands/brandsSlice.ts';
import { useEffect } from 'react';
import { getBrands } from '../../features/brands/brandsThunk.ts';
import BrandForHomePage from '../../components/Brand/BrandForHomePage/BrandForHomePage.tsx';
import { Box } from '@mui/material';
import Typography from '@mui/joy/Typography';
import Carousel from '../../components/UI/Carousel/Carousel.tsx';
import Footer from '../../components/footer/footer.tsx';

const HomePage = () => {
  const brands = useAppSelector(brandsFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands()).unwrap();
  }, [dispatch]);

  return (
    <>
      {brands.length > 0 && (
        <Box sx={{marginTop: '40px'}}>
          <div className='mb-5'>
            <Carousel />
          </div>
          <Typography sx={{ fontSize: '40px', mb: 0.5,  color: 'rgba(250, 143, 1, 1)', textAlign: 'center' }}>
            Наши бренды
          </Typography>
          <BrandForHomePage brands={brands} />
        </Box>
      )}
      <footer><Footer/></footer>
    </>
  );
};

export default HomePage;