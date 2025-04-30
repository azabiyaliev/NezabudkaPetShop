import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks.ts";
import { getProducts } from "../../../../store/products/productsThunk.ts";
import { selectProducts } from "../../../../store/products/productsSlice.ts";
import AdminBar from "../../AdminProfile/AdminBar.tsx";
import Typography from "@mui/joy/Typography";
import Products from "../components/Products.tsx";
import Grid from "@mui/material/Grid2";

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);

  useEffect(() => {
    dispatch(getProducts(''));
  }, [dispatch]);

  return (
    <Grid container spacing={2}>
      <Grid size={4} sx={{ margin: "30px 0" }}>
        <AdminBar />
      </Grid>
      <Grid size={8}>
        {products.length > 0 ? (
          <Products products={products} />
        ) : (
          <Typography level="h2" sx={{ fontSize: "xl", mb: 0.5 }}>
            Продуктов пока нет!
          </Typography>
        )}
      </Grid>
    </Grid>

  );
};

export default ProductsPage;
