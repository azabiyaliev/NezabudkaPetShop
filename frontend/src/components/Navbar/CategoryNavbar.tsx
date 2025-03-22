import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectCategories } from "../../features/categories/categoriesSlice.ts";
import { useEffect, useRef, useState } from "react";
import { fetchCategoriesThunk } from "../../features/categories/categoriesThunk.ts";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { NavLink } from "react-router-dom";
import { getAllProductsByCategory } from "../../features/products/productsThunk.ts";
import { SubcategoryWithBrand } from '../../types';
import "./NavBar.css";

const CategoryNavbar = () => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Record<number, SubcategoryWithBrand[]>>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const showMenu = async (categoryId: number, categoryTitle: string) => {
    if (categoryTitle !== "Собаки" && categoryTitle !== "Кошки") return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setOpenCategory(categoryId);

    if (!products[categoryId]) {
      const response = await dispatch(getAllProductsByCategory(categoryId));
      const newProducts = response.payload ?? [];

      setProducts((prev) => ({
        ...prev,
        [categoryId]: Array.isArray(newProducts) ? newProducts : [],
      }));
    }
  };

  const hideMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 300);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background:
          "linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)",
        width: "100vw",
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Toolbar>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              component="div"
              disablePadding

              onMouseEnter={() => showMenu(category.id, category.title)}
              onMouseLeave={hideMenu}
            >
              <ListItemButton
                sx={{
                  textAlign: "center",
                  backgroundColor: "transparent",
                  padding: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <ListItemText
                  primary={category.title}
                  className={
                    category.title === "Собаки" || category.title === "Кошки"
                      ? "category-link category-link-with-arrow"
                      : "category-link"
                  }
                />
              </ListItemButton>

              {openCategory === category.id && products[category.id] && (
                <Box className="show-modal">
                  {products[category.id].map((subcategory) => (
                    <Box key={subcategory.id} className="subcategory-block">
                      <h2 className="subcategory-title">{subcategory.title}</h2>

                      {subcategory.brands.map((brand) => (
                        <NavLink key={brand.id} to={`/brand/${brand.id}`} className="brand-link">
                          {brand.title}
                        </NavLink>
                      ))}
                    </Box>
                  ))}
                </Box>
              )}

            </ListItem>
          ))}
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default CategoryNavbar;
