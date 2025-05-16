import { Box } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { brandsFromSlice } from '../../../store/brands/brandsSlice.ts';
import { useEffect } from 'react';
import { getBrands } from '../../../store/brands/brandsThunk.ts';
import Typography from '@mui/joy/Typography';
import Brands from '../../../components/Domain/Brand/Brands/Brands.tsx';
import { SPACING } from '../../../globalStyles/stylesObjects.ts';

const BrandsPage = () => {
  const brands = useAppSelector(brandsFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands()).unwrap();
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex", margin: "30px 0",
      "@media (max-width: 1390px)": {
        flexDirection: "column",
      },
    }}>
      <Box
        sx={{
          flexShrink: 0,
          height: "100%",
          "@media (max-width: 1390px)": {
            display: "none",
          },
        }}
      >
        <AdminBar />
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        {brands.length > 0 ? (
          <Box sx={{ width: "90%", maxWidth: 1100, mt: SPACING.md}}>
            <Brands brands={brands}/>
          </Box>
        ) : (
          <Typography level="h2" sx={{ fontSize: 'xl', mb: 0.5 }}>
            Брендов пока нет!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BrandsPage;
