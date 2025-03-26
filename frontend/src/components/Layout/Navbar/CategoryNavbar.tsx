import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import { useEffect, useRef, useState } from 'react';
import { fetchCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { getAllProductsByCategory } from '../../../store/products/productsThunk.ts';
import { SubcategoryWithBrand } from '../../../types';
import './NavBar.css';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

const CategoryNavbar = () => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Record<number, SubcategoryWithBrand[]>>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const showMenu = async (categoryId: number) => {
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
        backgroundColor: '#ebf4e5',
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {categories.slice(0, 6).map((category) => (
              <ListItem
                key={category.id}
                component="div"
                disablePadding
                onMouseEnter={() => showMenu(category.id)}
                onMouseLeave={hideMenu}
              >
                <ListItemButton
                  sx={{
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    padding: '8px 16px',
                    color: '#343332',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '4px',
                    fontSize: '13px',
                    '&:hover': {
                      backgroundColor: '#dce5d9',
                    },
                  }}
                >
                  <ListItemText
                    primary={category.title}
                    className="category-link"
                    sx={{
                      color: '#343332',
                    }}
                  />
                  <ArrowDropDownOutlinedIcon sx={{ marginLeft: 1 }} />
                </ListItemButton>

                {openCategory === category.id && (
                  <Box className="show-modal">
                    {category.subcategories?.length ? (
                      category.subcategories.map((subcategory) => (
                        <Box key={subcategory.id} className="subcategory-block">
                          <a className="subcategory-title" href={String(subcategory.id)}>
                            {subcategory.title}
                          </a>
                        </Box>
                      ))
                    ) : (
                      <p className="no-subcategories">тут пока нет подкатегорий :)</p>
                    )}
                  </Box>
                )}
              </ListItem>
            ))}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default CategoryNavbar;
