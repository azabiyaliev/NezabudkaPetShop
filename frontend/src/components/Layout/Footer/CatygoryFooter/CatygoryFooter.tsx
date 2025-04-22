import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { fetchCategoriesThunk } from '../../../../store/categories/categoriesThunk.ts';
import { selectCategories } from '../../../../store/categories/categoriesSlice.ts';
import { Box } from '@mui/joy';
import { NavLink } from 'react-router-dom';

const CatygoryFooter = () => {
  const dispatch = useAppDispatch()
  const category = useAppSelector(selectCategories)

  useEffect(() => {
    dispatch(fetchCategoriesThunk())
  }, [dispatch]);

  return (
    <Box sx={{ textAlign: "left" }}>
      <p style={{ color: "lightgray", fontSize: "14px", marginBottom: "8px" }}>
       Каталог
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {category.map((cat) => (
          <Box
            key={cat.id}
            component="li"
            sx={{
              marginBottom: "4px",
            }}
          >
            <NavLink
              to={`/all-products/${cat.id}`}
              style={{
                color: "white",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              className={({ isActive }) =>
                isActive ? "active-category" : ""
              }
            >
              <Box
                component="span"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    color: "yellow",
                  },
                }}
              >
                {cat.title}
              </Box>
            </NavLink>
          </Box>
        ))}
      </ul>
    </Box>
  );
};

export default CatygoryFooter;