import { Box, Collapse, Container, ListItemButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { getProductsByCategory, } from '../../../store/products/productsThunk.ts';
import { selectProductsByCategory } from '../../../store/products/productsSlice.ts';
import { getFavoriteProducts } from '../../../store/favoriteProducts/favoriteProductsThunks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import { cartFromSlice, clearCart, getFromLocalStorage } from '../../../store/cart/cartSlice.ts';
import { fetchCart } from '../../../store/cart/cartThunk.ts';
import { userRoleClient } from '../../../globalConstants.ts';
import Grid from '@mui/material/Grid2';
import Filters from '../../Filters/Filters.tsx';
import ProductCard from '../../../components/Domain/ProductCard/ProductCard.tsx';
import { ICategories, Subcategory } from '../../../types';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { alpha } from '@mui/material/styles';
import { COLORS, FONTS, SPACING } from '../../../globalStyles/stylesObjects.ts';

const AllProductsCardsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductsByCategory);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const { id } = useParams();
  const categories = useAppSelector(selectCategories);
  const navigate = useNavigate();
  const selectedId = Number(id);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());

    if (user && user.role === userRoleClient) {
      dispatch(clearCart());
      dispatch(fetchCart());
    } else {
      dispatch(getFromLocalStorage());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!id || !categories.length) return;

    const numId = Number(id);
    dispatch(getProductsByCategory(numId));
    if (user) dispatch(getFavoriteProducts());
  }, [dispatch, user, id, categories]);

  const handleToggleCategory = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectCategory = (id: number) => {
    navigate(`/all-products/${id}`);
  };

  const renderCategories = (categories: (ICategories | Subcategory)[], depth = 0) => {
    return categories.map((category) => {
      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
      const isExpanded = expandedIds.includes(category.id);
      const isSelected = selectedId === category.id;

      return (
        <Box
          key={category.id}
          sx={{
            position: 'relative',
            ml: `calc(${SPACING.xs} * ${depth})`,
            mb: SPACING.xs,
            borderRadius: 2,
            backgroundColor: isSelected ? alpha(COLORS.primary, 0.08) : COLORS.white,
            border: isSelected
              ? `1px solid ${alpha(COLORS.primary, 0.4)}`
              : '1px solid transparent',
            boxShadow: isSelected ? `0 0 8px ${alpha(COLORS.primary, 0.2)}` : 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: isSelected
                ? alpha(COLORS.primary, 0.12)
                : alpha(COLORS.black, 0.04),
              transform: 'translateX(6px)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 3,
              height: '60%',
              backgroundColor: isSelected ? COLORS.primary : 'transparent',
              borderRadius: '0 4px 4px 0',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <ListItemButton
            onClick={() => handleSelectCategory(category.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: SPACING.sm,
              py: SPACING.xs,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, flexGrow: 1 }}>
              {hasSubcategories && (
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCategory(category.id);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                >
                  <ArrowDropDownOutlinedIcon
                    sx={{
                      fontSize: FONTS.size.lg,
                      color: isSelected ? COLORS.primary : COLORS.text,
                    }}
                  />
                </Box>
              )}

              <Typography
                sx={{
                  fontWeight: isSelected ? FONTS.weight.medium : FONTS.weight.normal,
                  color: isSelected ? COLORS.primary : COLORS.text,
                  fontSize: FONTS.size.default,
                  flexGrow: 1,
                  textAlign: 'left',
                }}
              >
                {category.title}
              </Typography>

              {hasSubcategories && (
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: alpha(COLORS.black, 0.05),
                    px: 1,
                    py: '2px',
                    borderRadius: 1,
                    color: COLORS.text,
                    fontSize: FONTS.size.xs,
                  }}
                >
                  {category.subcategories?.length || 0}
                </Typography>
              )}
            </Box>
          </ListItemButton>

          {isExpanded && hasSubcategories && (
            <Box sx={{ mt: 0.5 }}>
              {renderCategories(category.subcategories!, depth + 1)}
            </Box>
          )}
        </Box>
      );
    });
  };

  return (
    <Container>
      <Grid container spacing={2} sx={{mt: 4}}>
        <Grid size={3}>
          <Box  sx={{
            backgroundColor: COLORS.background,
            borderRadius: 2,
            p: SPACING.sm,
          }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: FONTS.weight.medium,
                color: COLORS.text,
                textAlign: 'center',
              }}
            >
              {(() => {
                const category = categories.find((cat) => cat.id === selectedId);
                const parent = categories.find((cat) =>
                  cat.subcategories?.some((sub) => sub.id === selectedId)
                );
                return (parent || category)?.title || 'Категории';
              })()}
            </Typography>
            {renderCategories(categories)}</Box>
          <Filters />
        </Grid>
        <Grid size={9}>
          {(() => {
            const parent = categories.find((cat) =>
              cat.subcategories?.some((sub) => sub.id === selectedId)
            );
            const sub = parent?.subcategories?.find((s) => s.id === selectedId);

            return (
              <Collapse in={!!sub} timeout={300} unmountOnExit>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      mt: 2,
                      mb: 4,
                      textAlign: "center",
                      fontWeight: FONTS.weight.bold,
                    }}
                  >
                    {sub?.title || ''}
                  </Typography>
                </Box>
              </Collapse>
            );
          })()}
          {products.length === 0 ? (
            <Typography textAlign="center" mt={4} color="text.secondary">
              Товары в данной категории отсутствуют.
            </Typography>
          ) : (
            <Grid container sx={{ justifyContent: "space-evenly", gap: 2 }}>
              {cart && products.map((product) => (
                <ProductCard product={product} key={product.id} cart={cart} />
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AllProductsCardsPage;