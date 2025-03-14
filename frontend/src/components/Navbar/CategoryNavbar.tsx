import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectCategories } from '../../features/categories/categoriesSlice.ts';
import { useEffect } from 'react';
import { fetchCategoriesThunk } from '../../features/categories/categoriesThunk.ts';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const CategoryNavbar = () => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();
  // const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  console.log(categories);

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)",
        width: "100vw",
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
            <ListItem key={category.id} disablePadding>
              <ListItemButton
                sx={{
                  textAlign: 'center',
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: "transparent" }
                }}
              >
                <ListItemText
                  primary={category.title}
                  sx={{
                    textTransform: "uppercase",
                    transition: "opacity 0.3s",
                    "&:hover": { opacity: 0.6 }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default CategoryNavbar;