import { TextField, Button, Box, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { CategoryMutation } from "../../../types";
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';

export interface Props {
  onSubmit: (category: CategoryMutation) => void;
}

const initialState = {
  title: '',
};

const WARNING_EMPTY_SUBCATEGORY = "Введите название подкатегории!";

const CategoryForm: React.FC<Props> = ({ onSubmit }) => {
  const [category, setCategory] = useState<CategoryMutation>(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category.title.trim() === "") {
      return toast.warning(WARNING_EMPTY_SUBCATEGORY , { position: "top-center" });
    }

    onSubmit({ ...category });
    setCategory(initialState);
  };

  const inputChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCategory((prevState) => ({
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
        mx: "auto",
        mt: 4,
        p: 3,
        margin: "15px",
        maxWidth: "100%",
        width: "100%",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" textAlign="left">
        Добавить новую категорию
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "stretch" }}>
        <TextField
          label="Название категории"
          variant="outlined"
          fullWidth
          name="title"
          value={category.title}
          onChange={inputChangeHandler}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            fontSize: 12,
            padding: "15px",
            textTransform: "uppercase",
            color: "white",
            background: "#237803",
            borderRadius: "10px",
            height: "100%",
            "&:hover": {
              backgroundColor: "#1e6600",
            },
            minWidth: "120px",
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Добавить
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryForm;
