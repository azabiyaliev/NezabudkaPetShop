import { TextField, Button, Box, Typography } from '@mui/material';
import React, { useCallback, useState } from "react";
import { CategoryMutation } from "../../../types";
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import {
  fetchCategoriesThunk,
  updateCategoryThunk
} from '../../../store/categories/categoriesThunk.ts';
import { toast } from 'react-toastify';

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

const EditCategory: React.FC<EditCategoryProps> = ({ category }) => {
  const [editedCategory, setEditedCategory] = useState<CategoryMutation>({
    title: category.title,
  });
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedCategory.title.trim() === "") {
      toast.warning(WARNING_SELECT_CATEGORY, { position: 'top-center' });
      return;
    }

    if (!user) return;

    await dispatch(updateCategoryThunk({
      id: String(category.id),
      category: {
        title: editedCategory.title,
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

      <Button type="submit" variant="contained" sx={{ bgcolor: "#237803", color: "white" }}>
        Сохранить изменения
      </Button>
    </Box>
  );
};

export default EditCategory;
