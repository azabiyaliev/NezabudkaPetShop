import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { getProductsByCategory, } from '../../../store/products/productsThunk.ts';
import { selectProductsByCategory } from '../../../store/products/productsSlice.ts';
import OneProductCard from '../components/OneProductCard.tsx';
import { getFavoriteProducts } from '../../../store/favoriteProducts/favoriteProductsThunks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchCategoriesThunk,
  fetchOneCategoryThunk,
} from '../../../store/categories/categoriesThunk.ts';
import { selectCategories, } from '../../../store/categories/categoriesSlice.ts';
import { clearCart } from '../../../store/cart/cartSlice.ts';
import { fetchCart } from '../../../store/cart/cartThunk.ts';

const AllProductsCardsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductsByCategory);
  const [columns, setColumns] = useState(4);
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

  const subcategories = selectedCategory?.subcategories || parentCategory?.subcategories;

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

  return (
    <Box sx={{ maxWidth: "1350px", margin: "0 auto", padding: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Typography fontWeight={500}>Отображение:</Typography>
        {[2, 3, 4, 5].map((num) => (
          <Box
            key={num}
            onClick={() => setColumns(num)}
            sx={{
              width: 24,
              height: 24,
              border: "1px solid #aaa",
              backgroundColor: columns === num ? "#000" : "#ccc",
              cursor: "pointer",
              display: "inline-block",
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, overflowX: "auto", pb: 1 }}>
        {(selectedCategory || parentCategory) && (
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box
              key={(selectedCategory || parentCategory)!.id}
              onClick={() =>
                navigate(
                  `/all-products/${(selectedCategory || parentCategory)!.id}`,
                )
              }
              sx={{
                minWidth: 160,
                maxWidth: 180,
                p: 2,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor:
                  (selectedCategory || parentCategory)?.id === selectedId
                    ? "#fff3e0"
                    : "#fff",
                border:
                  (selectedCategory || parentCategory)?.id === selectedId
                    ? "2px solid orange"
                    : "1px solid #ddd",
                cursor: "pointer",
                boxShadow:
                  (selectedCategory || parentCategory)?.id === selectedId
                    ? "0 4px 12px rgba(255, 165, 0, 0.3)"
                    : "none",
                transition: "0.2s",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Typography fontWeight={500} fontSize="14px">
                {(selectedCategory || parentCategory)?.title}
              </Typography>
            </Box>
          </Box>
        )}
        {subcategories && subcategories.map((subcategory) => {
          const isSelected = selectedId === subcategory.id;
          return (
            <Box
              key={subcategory.id}
              onClick={() => navigate(`/all-products/${subcategory.id}`)}
              sx={{
                minWidth: 160,
                maxWidth: 180,
                p: 2,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: isSelected ? "#fff3e0" : "#fff",
                border: isSelected ? "2px solid orange" : "1px solid #ddd",
                cursor: "pointer",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(255, 165, 0, 0.3)"
                  : "none",
                transition: "0.2s",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Typography fontWeight={500} fontSize="14px">
                {subcategory.title}
              </Typography>
            </Box>
          );
        })}
      </Box>
      {products.length === 0 ? (
        <Typography textAlign="center" mt={4} color="text.secondary">
          Товары в данной категории отсутствуют.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
          className={`product-card-box columns-${columns}`}
        >
          {products.map((product) => (
            <Box key={product.id}>
              <OneProductCard product={product} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AllProductsCardsPage;
