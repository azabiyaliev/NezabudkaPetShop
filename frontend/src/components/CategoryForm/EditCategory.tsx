import { TextField, Button, Box, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { CategoryMutation } from "../../types";
import { selectUser } from '../../features/users/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { fetchCategoriesThunk, updateCategoryThunk } from '../../features/categories/categoriesThunk.ts';
import { toast } from 'react-toastify';

interface EditCategoryProps {
  category: { id: string; title: string };
}

const EditCategory: React.FC<EditCategoryProps> = ({ category }) => {
  const [editedCategory, setEditedCategory] = useState<CategoryMutation>({ title: category.title });
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedCategory.title.trim() === "") {
      alert("Нельзя оставлять пустые поля");
      return;
    }

    if (!user) return;

    await dispatch(updateCategoryThunk({
      id: category.id,
      category: editedCategory,
      token: user.token,
    }));
    toast.success("Категория обновлена!");

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
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
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

      <Button type="submit" variant="contained" sx={{ bgcolor: "#ffc107", color: "black" }}>
        Сохранить изменения
      </Button>
    </Box>
  );
};

export default EditCategory;
