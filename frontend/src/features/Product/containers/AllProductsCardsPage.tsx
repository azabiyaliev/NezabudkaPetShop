import { Box, Button, Collapse, Fade, List, ListItem, ListItemButton, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  usePermission,
} from "../../../app/hooks.ts";
import {
  getProducts,
  getProductsByCategory,
} from "../../../store/products/productsThunk.ts";
import {
  selectProducts,
  selectProductsByCategory,
} from "../../../store/products/productsSlice.ts";
import { getFavoriteProducts } from "../../../store/favoriteProducts/favoriteProductsThunks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategoriesThunk } from "../../../store/categories/categoriesThunk.ts";
import { selectCategories } from "../../../store/categories/categoriesSlice.ts";
import {
  cartFromSlice,
  clearCart,
  getFromLocalStorage,
} from "../../../store/cart/cartSlice.ts";
import { fetchCart } from "../../../store/cart/cartThunk.ts";
import { userRoleClient } from "../../../globalConstants.ts";
import Filters from "../../Filters/Filters.tsx";
import ProductCard from "../../../components/Domain/ProductCard/ProductCard.tsx";
import { ICategories, Subcategory } from "../../../types";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { alpha } from "@mui/material/styles";
import { COLORS, FONTS, SPACING } from "../../../globalStyles/stylesObjects.ts";
import CustomPagination from "../../../components/Pagination/Pagination.tsx";
import Container from "@mui/material/Container";
import TuneIcon from "@mui/icons-material/Tune";
import FilterNavMenu from "../../Filters/FilterNavMenu.tsx";
import theme from "../../../globalStyles/globalTheme.ts";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

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
  const can = usePermission(user);
  const products = id ? categoryProducts : allProducts;
  const [openFilterMenu, setOpenFilterMenu] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ICategories | null>(null);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentCategory(null);
  };

  useEffect(() => {
    if (categories.length > 0) {
      if (id) {
        const category = categories.find((cat) => cat.id === Number(id)) ||
          categories
            .flatMap((cat) => cat.subcategories || [])
            .find((subcat) => subcat.id === Number(id));

        if (category) {
          document.title = `${category.title}`;
        } else {
          document.title = "Категория не найдена";
        }
      } else {
        document.title = "Все товары";
      }
    }
  }, [id, categories]);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());

    if (user && can([userRoleClient])) {
      dispatch(clearCart());
      dispatch(fetchCart());
    } else {
      dispatch(getFromLocalStorage());
    }
  }, [dispatch, user, can]);

  useEffect(() => {
    if (id && categories.length) {
      const numId = Number(id);
      dispatch(getProductsByCategory(numId));
    } else if (!id) {
      dispatch(getProducts(""));
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
    handleCloseModal();
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a.existence === b.existence) return 0;
    return a.existence ? -1 : 1;
  });

  const countProductsByCategory = (
    products: typeof allProducts,
    allCategories: ICategories[],
  ) => {
    const countMap: Record<number, number> = {};

    const subToParentMap: Record<number, number> = {};
    allCategories.forEach((cat) => {
      cat.subcategories?.forEach((sub) => {
        subToParentMap[sub.id] = cat.id;
      });
    });

    products.forEach((product) => {
      product.productCategory.forEach(({ category }) => {
        const catId = category.id;

        countMap[catId] = (countMap[catId] || 0) + 1;

        const parentId = subToParentMap[catId];
        if (parentId) {
          countMap[parentId] = (countMap[parentId] || 0) + 1;
        }
      });
    });

    return countMap;
  };

  const productCountMap = countProductsByCategory(allProducts, categories);

  const renderCategories = (
    categories: (ICategories | Subcategory)[],
    depth = 0,
  ) => {
    const items = [];

    const createMenuItem = (
      key: string | number,
      title: string,
      isSelected: boolean,
      onClick: () => void,
      hasSubcategories?: boolean,
      productCount?: number,
      toggleSubcategories?: (e: React.MouseEvent) => void,
      isExpanded?: boolean,
    ) => (
      <Box
        key={key}
        sx={{
          position: "relative",
          ml: `calc(${SPACING.xs} * ${depth})`,
          mb: SPACING.xs,
          borderRadius: 2,
          backgroundColor: isSelected
            ? alpha(COLORS.primary, 0.08)
            : COLORS.white,
          border: isSelected
            ? `1px solid ${alpha(COLORS.primary, 0.4)}`
            : "1px solid transparent",
          boxShadow: isSelected
            ? `0 0 8px ${alpha(COLORS.primary, 0.2)}`
            : "none",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: isSelected
              ? alpha(COLORS.primary, 0.12)
              : alpha(COLORS.black, 0.04),
            transform: "translateX(6px)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: "60%",
            backgroundColor: isSelected ? COLORS.primary : "transparent",
            borderRadius: "0 4px 4px 0",
            transition: "all 0.3s ease",
          },
        }}
      >
        <ListItemButton
          onClick={onClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: SPACING.sm,
            py: SPACING.xs,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: SPACING.sm,
              flexGrow: 1,
            }}
          >
            {hasSubcategories && toggleSubcategories && (
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubcategories(e);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                  transition: "transform 0.3s ease",
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <ArrowDropDownOutlinedIcon
                  sx={{
                    fontSize: FONTS.size.xxl,
                    color: isSelected ? COLORS.primary : COLORS.text,
                  }}
                />
              </Box>
            )}

            <Typography
              sx={{
                fontWeight: isSelected
                  ? FONTS.weight.medium
                  : FONTS.weight.normal,
                color: isSelected ? COLORS.primary : COLORS.text,
                fontSize: FONTS.size.default,
                flexGrow: 1,
                textAlign: "left",
              }}
            >
              {title}
            </Typography>

            {productCount !== undefined && productCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: alpha(COLORS.black, 0.05),
                  px: 1,
                  py: "2px",
                  borderRadius: 1,
                  color: COLORS.text,
                  fontSize: FONTS.size.xs,
                }}
              >
                {productCount}
              </Typography>
            )}
          </Box>
        </ListItemButton>
      </Box>
    );

    if (depth === 0) {
      items.push(
        createMenuItem(
          "all-products",
          "Все товары",
          !id,
          () => navigate("/all-products"),
          false,
          allProducts.length,
        ),
      );
    }

    categories.forEach((category) => {
      const hasSubcategories =
        category.subcategories && category.subcategories.length > 0;
      const isExpanded = expandedIds.includes(category.id);
      const isSelected = selectedId === category.id;

      const categoryItem = createMenuItem(
        category.id,
        category.title,
        isSelected,
        () => handleSelectCategory(category.id),
        hasSubcategories,
        productCountMap[category.id],
        hasSubcategories
          ? (e) => {
              e.stopPropagation();
              handleToggleCategory(category.id);
            }
          : undefined,
        isExpanded,
      );

      items.push(
        <React.Fragment key={`fragment-${category.id}`}>
          {categoryItem}
          {isExpanded && hasSubcategories && (
            <Box sx={{ mt: 0.5 }}>
              {renderCategories(category.subcategories!, depth + 1)}
            </Box>
          )}
        </React.Fragment>,
      );
    });

    return items;
  };

  const closeFilterMenu = () => {
    setOpenFilterMenu(false);
  };

  const renderCategoriesInModal = (categoriesList: ICategories[]) => {
    return (
      <>
        <ListItem disablePadding key="all-products">
          <ListItemButton
            onClick={() => navigate("/all-products")}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              py: 1,
              px: 2,
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#f1f8e9",
              },
            }}
          >
            <Typography fontWeight="bold">Все товары</Typography>
          </ListItemButton>
        </ListItem>

        {categoriesList.map((category) => (
          <ListItem disablePadding key={category.id}>
            <ListItemButton
              onClick={() =>
                category.subcategories?.length
                  ? setCurrentCategory(category)
                  : handleSelectCategory(category.id)
              }
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                py: 1,
                px: 2,
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "#f1f8e9",
                },
              }}
            >
              <Typography fontWeight={500}>{category.title}</Typography>
              {category.subcategories?.length ? (
                <ArrowRightIcon sx={{ mr: 1 }} />
              ) : null}
            </ListItemButton>
          </ListItem>
        ))}
      </>
    );
  };


  const renderSubcategoriesInModal = (category: ICategories) => {
    return category.subcategories?.map((sub) => (
      <ListItem disablePadding key={sub.id}>
        <ListItemButton
          onClick={() => handleSelectCategory(sub.id)}
          sx={{
            pl: 5,
            py: 1,
            mx: 1,
            my: 0.5,
            borderRadius: 2,
            transition: "0.2s",
            "&:hover": {
              backgroundColor: "#f1f8e9",
            },
          }}
        >
          <Typography>{sub.title}</Typography>
        </ListItemButton>
      </ListItem>
    ));
  };


  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          mt: 4,
          "@media (max-width: 1150px)": {
            justifyContent: "center",
          },
        }}
      >
        <Box
          sx={{
            flex: "0 0 25%",
            maxWidth: "25%",
            "@media (max-width: 1150px)": {
              display: "none",
            },
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              height: "100vh",
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "8px",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                borderRadius: "4px",
              },
            }}
          >
            <Box
              sx={{
                backgroundColor: COLORS.background,
                borderRadius: 2,
                p: SPACING.sm,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: FONTS.weight.medium,
                  color: COLORS.text,
                  textAlign: "center",
                }}
              >
                {(() => {
                  if (!id) return "Все товары";

                  const category = categories.find(
                    (cat) => cat.id === selectedId,
                  );
                  const parent = categories.find((cat) =>
                    cat.subcategories?.some((sub) => sub.id === selectedId),
                  );
                  return (parent || category)?.title || "Категории";
                })()}
              </Typography>
              {renderCategories(categories)}
            </Box>

            <Filters />

          </Box>
        </Box>

        <Box
          sx={{
            flex: "1 1 75%",
            maxWidth: "75%",
            "@media (max-width: 1150px)": {
              maxWidth: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mt: 2,
              mb: 2,
              textAlign: "center",
              fontWeight: FONTS.weight.bold,
            }}
          >
            <PetsIcon sx={{mr: 1, color: COLORS.primary, fontSize: 30}}/>
            {id
              ? (() => {
                const category = categories.find(
                  (cat) => cat.id === selectedId,
                );
                const parent = categories.find((cat) =>
                  cat.subcategories?.some((sub) => sub.id === selectedId),
                );
                return (parent || category)?.title || "";
              })()
              : "Все товары"}
            <PetsIcon sx={{ml: 1, color: COLORS.primary, fontSize: 30}}/>
          </Typography>

          {id &&
            (() => {
              const parent = categories.find((cat) =>
                cat.subcategories?.some((sub) => sub.id === selectedId),
              );
              const sub = parent?.subcategories?.find(
                (s) => s.id === selectedId,
              );

              return (
                <Collapse in={!!sub} timeout={300} unmountOnExit>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mt: 2,
                        textAlign: "center",
                        fontWeight: FONTS.weight.bold,
                      }}
                    >
                      {sub?.title || ""}
                    </Typography>
                  </Box>
                </Collapse>
              );
            })()}


          <Modal open={openModal} onClose={handleCloseModal}>
            <Fade in={openModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "85%",
                  maxWidth: 400,
                  backgroundColor: "white",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxHeight: "80vh",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">
                    {currentCategory ? "Выберите подкатегорию" : "Выберите категорию"}
                  </Typography>
                  <CloseIcon onClick={handleCloseModal} sx={{ cursor: "pointer" }} />
                </Box>

                <Box
                  sx={{
                    overflowY: "auto",
                    flexGrow: 1,
                    minHeight: 100,
                  }}
                >
                  <List>
                    {!currentCategory
                      ? renderCategoriesInModal(categories)
                      : renderSubcategoriesInModal(currentCategory)}
                  </List>
                </Box>

                {currentCategory && (
                  <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setCurrentCategory(null)}
                    sx={{
                      mt: 2,
                      backgroundColor: COLORS.primary,
                      color: theme.colors.white,
                      borderRadius: 2,
                      textTransform: "none",
                      boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    Назад к категориям
                  </Button>
                )}
              </Box>
            </Fade>
          </Modal>


          <Button
            onClick={handleOpenModal}
            sx={{
              backgroundColor:  COLORS.primary,
              color: theme.colors.white,
              boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.16)",
              borderRadius: 2,
              textTransform: "none",
              margin: "20px auto 20px",
              "@media (min-width: 1150px)": {
                display: "none",
              },
            }}
          >
            Выбрать категорию
          </Button>

          <FilterNavMenu
            closeMenu={closeFilterMenu}
            openMenu={openFilterMenu}
          />

          <Box
            sx={{
              display: "none",
              justifyContent: "center",
              "@media (max-width: 1150px)": {
                display: "flex",
              },
            }}
          >
            <Box
              sx={{
                borderRadius: 3,
                background: "#fff",
                boxShadow:
                  "0 -2px 4px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.16)",
                width: "90%",
              }}
            >
              <Box
                onClick={() => setOpenFilterMenu(true)}
                sx={{
                  cursor: "pointer",
                  fontWeight: FONTS.weight.medium,
                  color: COLORS.text,
                  padding: 2,
                }}
              >
                Фильтры
                <TuneIcon sx={{ color: theme.colors.primary, marginLeft: 1 }} />
              </Box>
            </Box>
          </Box>

          {products.length === 0 ? (
            <Typography textAlign="center" mt={4} color="text.secondary">
              {id
                ? "Товары в данной категории отсутствуют."
                : "Товары отсутствуют."}
            </Typography>
          ) : (
            <CustomPagination
              items={sortedProducts}
              columns={4}
              renderItem={(product) => (
                <ProductCard product={product} key={product.id} cart={cart} />
              )}
            />
          )}
        </Box>
      </Box>
    </Container>

  );
};

export default AllProductsCardsPage;
