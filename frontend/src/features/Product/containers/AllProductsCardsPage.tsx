import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { getProductsByCategory } from "../../../store/products/productsThunk.ts";
import { selectProductsByCategory } from "../../../store/products/productsSlice.ts";
import OneProductCard from "../components/OneProductCard.tsx";
import { getFavoriteProducts } from "../../../store/favoriteProducts/favoriteProductsThunks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCategoriesThunk,
  fetchOneCategoryThunk,
} from "../../../store/categories/categoriesThunk.ts";
import { selectCategories } from "../../../store/categories/categoriesSlice.ts";
import { clearCart } from "../../../store/cart/cartSlice.ts";
import { fetchCart } from "../../../store/cart/cartThunk.ts";
import Grid from "@mui/material/Grid2";

const AllProductsCardsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductsByCategory);
  const user = useAppSelector(selectUser);
  const { id } = useParams();
  const categories = useAppSelector(selectCategories);
  const navigate = useNavigate();
  const selectedId = Number(id);
  const selectedCategory = categories.find(
    (category) => category.id === selectedId,
  );
  const parentCategory = categories.find((category) =>
    category.subcategories?.some((sub) => sub.id === selectedId),
  );

  const isSubcategorySelected = !!parentCategory;
  const baseCategory = isSubcategorySelected
    ? parentCategory
    : selectedCategory;
  const subcategories = baseCategory?.subcategories;
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    dispatch(fetchCategoriesThunk()).unwrap();

    if (user) {
      dispatch(clearCart());
      dispatch(fetchCart()).unwrap();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!id || !categories.length) return;
    if (id) {
      const numId = Number(id);
      dispatch(getProductsByCategory(numId));
      const parent = categories.find((category) =>
        category.subcategories?.some((sub) => sub.id === numId),
      );
      if (parent) dispatch(fetchOneCategoryThunk(String(parent.id))).unwrap();
    }
    if (user) dispatch(getFavoriteProducts());
  }, [dispatch, user, id, categories]);

  const handleSubcategoryClick = (subcategoryId: number) => {
    if (subcategoryId === activeSubcategoryId && baseCategory) {
      setActiveSubcategoryId(null);
      navigate(`/all-products/${baseCategory.id}`);
    } else {
      setActiveSubcategoryId(subcategoryId);
      navigate(`/all-products/${subcategoryId}`);
    }
  };
  return (
    <Container>
      <Typography variant="h4">{baseCategory?.title}</Typography>
      <Grid container spacing={2}>
        <Grid size={3}>
          <Box sx={{ maxWidth: '100%' }}>
            {subcategories?.map((subcategory) => {
              const isSelected = activeSubcategoryId === subcategory.id;
              return (
                <Box
                  key={subcategory.id}
                  onClick={() => handleSubcategoryClick(subcategory.id)}
                  sx={{
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: isSelected ? "#fff3e0" : "#f9f9f9",
                    border: isSelected ? "2px solid orange" : "1px solid #ddd",
                    cursor: "pointer",
                    fontWeight: isSelected ? 600 : 400,
                    "&:hover": {
                      backgroundColor: "#f1f1f1",
                    },
                  }}
                >
                  {subcategory.title}
                </Box>
              );
            })}
          </Box>
        </Grid>
        <Grid size={9}>
          {products.length === 0 ? (
            <Typography textAlign="center" mt={4} color="text.secondary">
              Товары в данной категории отсутствуют.
            </Typography>
          ) : (
            <Grid container sx={{ justifyContent: "space-evenly", gap: 2 }}>
              {products.map((product) => (
                  <OneProductCard product={product} key={product.id} />
              ))}
            </Grid>
          )}
        </Grid>

      </Grid>
    </Container>
  );
};

export default AllProductsCardsPage;
