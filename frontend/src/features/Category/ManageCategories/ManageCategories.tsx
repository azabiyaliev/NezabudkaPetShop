import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectCategories } from '../../../store/categories/categoriesSlice.ts';
import { fetchCategoriesThunk, updateCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import NewCategory from '../NewCategory/NewCategory.tsx';

const ManageCategories = () => {
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();

  const [currentCategory, setCurrentCategory] = useState(categories);

  const dragSub = useRef<{ categoryId: number; subcategoryIndex: number } | null>(null);
  const draggedOverSub = useRef<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    setCurrentCategory(categories);
  }, [categories]);

  console.log(currentCategory);

  const handlerSort = () => {
    if (dragSub.current && draggedOverSub.current !== null) {
      const { categoryId, subcategoryIndex } = dragSub.current;

      const updatedCategories = currentCategory.map((category) => {
        if (category.id === categoryId && category.subcategories) {
          const subCategoriesClone = [...category.subcategories];

          const draggedSubCategory = subCategoriesClone[subcategoryIndex];
          subCategoriesClone.splice(subcategoryIndex, 1);
          subCategoriesClone.splice(draggedOverSub.current!, 0, draggedSubCategory);

          return { ...category, subcategories: subCategoriesClone };
        }
        return category;
      });

      setCurrentCategory(updatedCategories);

      dispatch(updateCategoriesThunk(updatedCategories));
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" textAlign="left" sx={{ mt: 4 }}>
          Управление категориями
        </Typography>

        <NewCategory />

        <Typography sx={{ fontSize: "18px" }} textAlign="left" mt={2}>
          Категории (перетащите для изменения иерархии)
        </Typography>

        <Typography
          sx={{ fontSize: "13px", mt: 1, color: "#757575" }}
          textAlign="left"
        >
          Перетащите категорию (подкатегорию), чтобы изменить её порядок или
          положение в иерархии. Для создания подкатегории, перетащите категорию
          в подсвеченную область другой категории.
        </Typography>

        <Box sx={{ mt: 4 }}>
          {currentCategory.map((category) => (
            <Box key={category.id} sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                {category.title}
              </Typography>

              {category.subcategories && category.subcategories.length > 0 ? (
                <List sx={{ pl: 2, borderRadius: 1 }}>
                  {category.subcategories.map((sub, index) => (
                    <ListItem
                      onDragStart={() => {
                        dragSub.current = { categoryId: category.id, subcategoryIndex: index };
                      }}
                      onDragEnter={() => {
                        draggedOverSub.current = index;
                      }}
                      onDragEnd={handlerSort}
                      onDragOver={(e) => e.preventDefault()}
                      draggable={true}
                      key={sub.id}
                      sx={{ my: 1, bgcolor: '#f1f1f1', borderRadius: 1 }}
                      secondaryAction={
                        <>
                          <IconButton edge="end" aria-label="edit">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete" sx={{ ml: 1 }} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText primary={sub.title} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                  Нет подкатегорий
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default ManageCategories;
