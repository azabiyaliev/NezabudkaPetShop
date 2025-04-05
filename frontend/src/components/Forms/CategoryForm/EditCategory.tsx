import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import React, { useCallback, useState } from "react";
import { CategoryMutation } from "../../../types";
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import {
  deleteCategory,
  fetchCategoriesThunk,
  updateCategoryThunk
} from '../../../store/categories/categoriesThunk.ts';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';

interface Subcategory {
  id: number;
  title: string;
  parentId: string | number | null;
  subcategories?: Subcategory[];
}

interface EditCategoryProps {
  category: {
    id: number;
    title: string;
    subcategories?: Subcategory[];
  };
}

const WARNING_SELECT_CATEGORY = "Не оставляйте поля пустыми!!";
const SUCCESSFUL_CATEGORY_UPDATE = "Категория успешно обновлена!";
const SUCCESSFUL_CATEGORY_DELETE = "Категория успешно удалена!";
const ERROR_CATEGORY_DELETE = "Ошибка при удалении подкатегории!";

const EditCategory: React.FC<EditCategoryProps> = ({ category }) => {
  const [editedCategory, setEditedCategory] = useState<CategoryMutation>({
    title: category.title,
    subcategories: category.subcategories || [],
  });
  const [subcategories, setSubcategories] = useState<Subcategory[]>(category.subcategories || []);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedCategory.title.trim() === "") {
      toast.warning(WARNING_SELECT_CATEGORY, { position: 'top-center' });
      return;
    }

    for (const subcategory of subcategories) {
      if (subcategory.title.trim() === "") {
        toast.warning("Не оставляйте поля подкатегорий пустыми!", { position: 'top-center' });
        return;
      }
    }

    if (!user) return;

    const updatedSubcategories = subcategories.map(sub => ({
      id: sub.id,
      title: sub.title,
      parentId: sub.parentId,
    }));


    await dispatch(updateCategoryThunk({
      id: String(category.id),
      category: {
        title: editedCategory.title,
        subcategories: updatedSubcategories || [],
      },
      token: user.token,
    }));

    toast.success(SUCCESSFUL_CATEGORY_UPDATE, { position: 'top-center' });

    await dispatch(fetchCategoriesThunk());
  };

  const inputChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedCategory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSubcategoryChange = (id: number, value: string) => {
    setSubcategories(prev =>
      prev.map(sub =>
        sub.id === id ? { ...sub, title: value } : sub
      )
    );
  };

  const onDelete = async (id: string) => {
    try {
      await dispatch(deleteCategory(id));
      setSubcategories(prev => prev.filter(sub => sub.id !== Number(id))); // Убираем из локального состояния
      toast.success(SUCCESSFUL_CATEGORY_DELETE, { position: 'top-center' });
    } catch (error) {
      console.log(error);
      toast.error(ERROR_CATEGORY_DELETE, { position: 'top-center' });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h6" textAlign="center">
        Редактировать категорию
      </Typography>

      <TextField
        label="Название категории"
        variant="outlined"
        fullWidth
        required
        name="title"
        value={editedCategory.title}
        onChange={inputChangeHandler}
      />

      {subcategories.length > 0 && (
        <>
          <Typography variant="h6" textAlign="center">
            Редактировать подкатегории
          </Typography>
          {subcategories.map((sub, index) => (
            <Box key={sub.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ width: '30px' }}>
                {index + 1}.
              </Typography>
              <TextField
                label="Название Подкатегории"
                variant="outlined"
                fullWidth
                value={sub.title}
                onChange={(e) => handleSubcategoryChange(sub.id, e.target.value)}
              />
              <IconButton
                onClick={() => onDelete(String(sub.id))}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </>
      )}

      <Button type="submit" variant="contained" sx={{ bgcolor: "#ffc107", color: "black" }}>
        Сохранить изменения
      </Button>
    </Box>
  );
};

export default EditCategory;
