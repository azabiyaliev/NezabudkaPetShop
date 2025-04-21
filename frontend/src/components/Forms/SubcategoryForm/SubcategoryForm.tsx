import {
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  addNewSubcategory,
  fetchCategoriesThunk,
} from '../../../store/categories/categoriesThunk.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';

const WARNING_EMPTY_SUBCATEGORY = "Введите название подкатегории!";
const ERROR_SUBCATEGORY = "Ошибка при добавлении подкатегории!";
const SUCCESS_SUBCATEGORY = "Подкатегория была добавлена ;)";

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
      return toast.warning(WARNING_EMPTY_SUBCATEGORY, { position: "top-center" });
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
        toast.success(SUCCESS_SUBCATEGORY, { position: "top-center" });
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(ERROR_SUBCATEGORY, { position: "top-center" });
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
