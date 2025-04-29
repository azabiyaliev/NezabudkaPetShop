import { Box, Collapse, Container, ListItemButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { getProducts, getProductsByCategory, } from '../../../store/products/productsThunk.ts';
import { selectProducts, selectProductsByCategory } from '../../../store/products/productsSlice.ts';
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
  const categoryProducts = useAppSelector(selectProductsByCategory);
  const allProducts = useAppSelector(selectProducts);
  const user = useAppSelector(selectUser);
  const cart = useAppSelector(cartFromSlice);
  const { id } = useParams();
  const categories = useAppSelector(selectCategories);
  const navigate = useNavigate();
  const selectedId = Number(id);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  // Определяем, какие продукты отображать: все или по категории
  const products = id ? categoryProducts : allProducts;

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
    // Если есть id категории, загружаем товары по категории
    if (id && categories.length) {
      const numId = Number(id);
      dispatch(getProductsByCategory(numId));
    }
    // Если id нет, загружаем все товары
    else if (!id) {
      dispatch(getProducts(''));
    }

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
    const items = [];

    // Вспомогательная функция для создания элемента меню
    const createMenuItem = (
      key: string | number,
      title: string,
      isSelected: boolean,
      onClick: () => void,
      hasSubcategories?: boolean,
      subcategoryCount?: number,
      toggleSubcategories?: (e: React.MouseEvent) => void,
      isExpanded?: boolean
    ) => (
      <Box
        key={key}
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
          onClick={onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: SPACING.sm,
            py: SPACING.xs,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, flexGrow: 1 }}>
            {hasSubcategories && toggleSubcategories && (
              <Box
                onClick={toggleSubcategories}
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
              {title}
            </Typography>

            {subcategoryCount !== undefined && (
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
                {subcategoryCount}
              </Typography>
            )}
          </Box>
        </ListItemButton>
      </Box>
    );

    // Добавляем пункт "Все товары" только на верхнем уровне
    if (depth === 0) {
      items.push(
        createMenuItem(
          'all-products',
          'Все товары',
          !id,
          () => navigate('/all-products'),
          false,
          allProducts.length
        )
      );
    }

    // Добавляем остальные категории
    categories.forEach(category => {
      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
      const isExpanded = expandedIds.includes(category.id);
      const isSelected = selectedId === category.id;

      const categoryItem = createMenuItem(
        category.id,
        category.title,
        isSelected,
        () => handleSelectCategory(category.id),
        hasSubcategories,
        hasSubcategories ? category.subcategories?.length : undefined,
        hasSubcategories ? (e) => {
          e.stopPropagation();
          handleToggleCategory(category.id);
        } : undefined,
        isExpanded
      );

      items.push(
        <React.Fragment key={`fragment-${category.id}`}>
          {categoryItem}
          {isExpanded && hasSubcategories && (
            <Box sx={{ mt: 0.5 }}>
              {renderCategories(category.subcategories!, depth + 1)}
            </Box>
          )}
        </React.Fragment>
      );
    });

    return items;
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
                if (!id) return 'Все товары';

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
          {id && (() => {
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

          {!id && (
            <Typography
              variant="h4"
              sx={{
                mt: 2,
                mb: 4,
                textAlign: "center",
                fontWeight: FONTS.weight.bold,
              }}
            >
              Все товары
            </Typography>
          )}

          {products.length === 0 ? (
            <Typography textAlign="center" mt={4} color="text.secondary">
              {id ? 'Товары в данной категории отсутствуют.' : 'Товары отсутствуют.'}
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