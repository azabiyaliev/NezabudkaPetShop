import { Box } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { brandsFromSlice } from '../../../features/brands/brandsSlice.ts';
import { useEffect } from 'react';
import { getBrands } from '../../../features/brands/brandsThunk.ts';
import Brands from '../../../components/Brand/Brands/Brands.tsx';
import Typography from '@mui/joy/Typography';

const BrandsPage = () => {
  const brands = useAppSelector(brandsFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands()).unwrap();
  }, [dispatch]);

  console.log(brands);

  return (
    <Box sx={{ display: 'flex', margin: '30px 0'}}>
      <AdminBar/>
      <Box sx={{
        marginLeft: '20px'
      }}>
        {brands.length > 0 ? <Brands brands={brands} /> :  <Typography level="h2" sx={{ fontSize: 'xl', mb: 0.5 }}>
         Брендов пока нет!
        </Typography>
        }
      </Box>
    </Box>
  );
};

export default BrandsPage;