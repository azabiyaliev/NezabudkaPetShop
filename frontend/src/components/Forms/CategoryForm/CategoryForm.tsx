import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import { CategoryMutation } from '../../../types';
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import FileInputCategory from '../../FileInput/FileInputCategory.tsx';

export interface Props {
  onSubmit: (category: CategoryMutation) => void;
}

const initialState: CategoryMutation = {
  title: '',
  icon: null,
  image: null,
};

const WARNING_EMPTY_SUBCATEGORY = "Введите название подкатегории!";

const CategoryForm: React.FC<Props> = ({ onSubmit }) => {
  const [category, setCategory] = useState<CategoryMutation>(initialState);

  const iconInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category.title.trim() === "") {
      return toast.warning(WARNING_EMPTY_SUBCATEGORY, { position: "top-center" });
    }

    onSubmit({ ...category });
    setCategory(initialState); // Сброс state

    // Очистка инпутов файлов через ref
    if (iconInputRef.current) iconInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const inputChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCategory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setCategory((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 800, margin: "30px auto" }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Добавить новую категорию
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Название категории"
              name="title"
              value={category.title}
              onChange={inputChangeHandler}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FileInputCategory
              id="icon"
              name="icon"
              label="Иконка категории"
              onGetFile={onFileChange}
              file={category.icon || null}
              inputRef={iconInputRef}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FileInputCategory
              id="image"
              name="image"
              label="Изображение категории"
              onGetFile={onFileChange}
              file={category.image || null}
              inputRef={imageInputRef}
            />
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#237803",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#1e6600",
                },
              }}
            >
              Добавить
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CategoryForm;
