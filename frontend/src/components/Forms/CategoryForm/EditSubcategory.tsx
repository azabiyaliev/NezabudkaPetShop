import { TextField, Button, Box, Typography } from '@mui/material';
import React, { useCallback, useState } from "react";
import { CategoryMutation } from "../../../types";
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import {
  fetchCategoriesThunk,
  updateSubcategoryThunk
} from '../../../store/categories/categoriesThunk.ts';
import { enqueueSnackbar } from 'notistack';

interface EditSubcategoryProps {
  subcategory: {
    id: number;
    title: string;
    parentId: number;
  };
  onClose: () => void;
}

const EditSubcategory: React.FC<EditSubcategoryProps> = ({ subcategory,  onClose}) => {
  const [editedSubcategory, setEditedSubcategory] = useState<CategoryMutation>({
    title: subcategory.title,
  });

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedSubcategory.title.trim() === "") {
      enqueueSnackbar('Не оставляйте поля пустыми!', { variant: 'error' });
      return;
    }

    if (!user) return;

    await dispatch(updateSubcategoryThunk({
      id: Number(subcategory.id),
      subcategory: {
        title: editedSubcategory.title,
      },
      token: user.token,
    }));
    enqueueSnackbar('Подкатегория успешно обновлена!', { variant: 'success' });

    await dispatch(fetchCategoriesThunk());
    onClose();
  };

  const inputChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedSubcategory((prevState) => ({
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
        Редактировать подкатегорию
      </Typography>

      <TextField
        label="Название подкатегории"
        variant="outlined"
        fullWidth
        required
        name="title"
        value={editedSubcategory.title}
        onChange={inputChangeHandler}
      />

      <Button type="submit" variant="contained" sx={{ bgcolor: "#237803", color: "white" }}>
        Сохранить изменения
      </Button>
    </Box>
  );
};

export default EditSubcategory;
