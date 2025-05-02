import { Box } from "@mui/material";
import AdminBar from "../AdminProfile/AdminBar.tsx";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { brandsFromSlice } from "../../../store/brands/brandsSlice.ts";
import { useEffect } from "react";
import { getBrands } from "../../../store/brands/brandsThunk.ts";
import Brands from "../../../components/Domain/Brand/Brands/Brands.tsx";
import Typography from "@mui/joy/Typography";

const BrandsPage = () => {
  const brands = useAppSelector(brandsFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands()).unwrap();
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex", margin: "30px 0" }}>
      <AdminBar />

      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        <Box sx={{ maxWidth: 800, width: "100%", px: 2 }}>
          {brands.length > 0 ? (
            <Brands brands={brands} />
          ) : (
            <Typography level="h2" sx={{ fontSize: "xl", mb: 0.5, textAlign: "center" }}>
              Брендов пока нет!
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BrandsPage;
