import { TextField, Button, Box, Typography } from "@mui/material";
import React, { useCallback, useState } from 'react';
import { CategoryMutation } from '../../types';

export interface Props {
  onSubmit: (category: CategoryMutation) => void;
}

const initialState = {
  title: '',
};

const CategoryForm: React.FC<Props> = ({onSubmit}) => {
  const [category, setCategory] = useState<CategoryMutation>(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(category);
    if(category.title.trim() === '') {
      alert('Нельзя оставлять пустые поля');
      return;
    }

    onSubmit({...category});
    setCategory(initialState);
  };

  const inputChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setCategory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  return (
    <>
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
          Добавить категорию / подкатегорию
        </Typography>

        <TextField
          label="Название категории"
          variant="outlined"
          fullWidth
          required
          name="title"
          value={category.title}
          onChange={inputChangeHandler}
        />

        <Button type="submit" variant="contained" sx={{ bgcolor: "#ffc107", color: "black" }}>
          Добавить
        </Button>
      </Box>
    </>
  );
};

export default CategoryForm;