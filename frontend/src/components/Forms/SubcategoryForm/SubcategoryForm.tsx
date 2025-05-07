import {
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import React, { useState } from "react";
import {
  addNewSubcategory,
  fetchCategoriesThunk,
} from '../../../store/categories/categoriesThunk.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { enqueueSnackbar } from 'notistack';

interface Props {
  categoryId: number;
  onClose: () => void;
}

const SubcategoryForm: React.FC<Props> = ({ categoryId, onClose }) => {
  const [newSubcategory, setNewSubcategory] = useState("");

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newSubcategory.trim() === "") {
      return enqueueSnackbar('Введите название подкатегории!', { variant: 'error' });
    }

    try {
      if (user) {
        await dispatch(
          addNewSubcategory({
            id: categoryId,
            subcategories: [newSubcategory],
            token: user.token,
          })
        );

        await dispatch(fetchCategoriesThunk());
        setNewSubcategory("");
        onClose();
        enqueueSnackbar('Вы успешно добавили подкатегорию', { variant: 'success' });
      }
    } catch (error) {
      console.error(error);
      return enqueueSnackbar('Ошибка при добавлении подкатегории!', { variant: 'error' });
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
        width: '100%',
        mx: "auto",
      }}
    >
      <Typography variant="h6" textAlign="center">
        Добавить подкатегорию
      </Typography>

      <Box sx={{ width: '100%' }}>
        <TextField
          sx={{ width: "100%" }}
          fullWidth
          label="Добавить новую подкатегорию"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        sx={{
          textTransform: "uppercase",
          color: "white",
          background: "#237803",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "#1e6600",
          },
        }}
      >
        Добавить
      </Button>
    </Box>
  );
};

export default SubcategoryForm;
