import { TextField, Button, Box, Typography } from "@mui/material";
import React, { useCallback, useState } from 'react';
import { CategoryMutation } from '../../../types';
import { selectLoading } from '../../../store/categories/categoriesSlice.ts';
import { useAppSelector } from '../../../app/hooks.ts';
import { toast } from 'react-toastify';

export interface Props {
  onSubmit: (category: CategoryMutation) => void;
}

const initialState = {
  title: '',
};

const CategoryForm: React.FC<Props> = ({onSubmit}) => {
  const [category, setCategory] = useState<CategoryMutation>(initialState);
  const isLoading = useAppSelector(selectLoading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(category);
    if(category.title.trim() === '') {
      return toast.warning("Необходимо название категории!");
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
          Добавить категорию
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

        <Button
          type="submit"
          variant="contained"
          sx={{
            textTransform: 'uppercase',
            color: 'white',
            background: isLoading ? 'transparent' : '#237803',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#1e6600',
            },
          }}
        >
          Добавить
        </Button>
      </Box>
    </>
  );
};

export default CategoryForm;
