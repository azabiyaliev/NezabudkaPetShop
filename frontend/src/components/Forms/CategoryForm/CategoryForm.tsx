import { TextField, Button, Box, Typography, Paper, IconButton } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import { CategoryMutation } from '../../../types';
import FileInputCategory from '../../FileInput/FileInputCategory.tsx';
import { apiUrl } from '../../../globalConstants.ts';
import CloseIcon from '@mui/icons-material/Close';
import { enqueueSnackbar } from 'notistack';
import theme from '../../../globalStyles/globalTheme.ts';

export interface Props {
  onSubmit: (category: CategoryMutation) => void;
}

const initialState: CategoryMutation = {
  title: '',
  image: null,
};

const CategoryForm: React.FC<Props> = ({ onSubmit }) => {
  const [category, setCategory] = useState<CategoryMutation>(initialState);

  const iconInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category.title.trim() === "") {
      return enqueueSnackbar('Введите название подкатегории!', { variant: 'error' });
    }

    onSubmit({ ...category });
    setCategory(initialState);

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

  const deleteImageHandler = () => {
    setCategory((prevState) => ({
      ...prevState,
      image: null,
    }));
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 800, margin: "10px auto" , width: "100%"}}>
      <Typography  gutterBottom sx={{ textAlign: 'center', fontWeight: 600, mb:"10px" }}>
        Добавить новую категорию
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 2, alignItems: "center", flexDirection: "column" }}>
          <Box sx={{ width: "100%"}}>
            <TextField
              label="Название категории"
              name="title"
              value={category.title}
              onChange={inputChangeHandler}
              fullWidth
              required
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
            <FileInputCategory
              id="image"
              name="image"
              label="Изображение категории"
              onGetFile={onFileChange}
              file={category.image || null}
              inputRef={imageInputRef}
            />

            <Box
              sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                height: '100px',
                backgroundColor: theme.colors.rgbaGrey,
                border: `1px dashed ${theme.colors.DARK_GRAY} `,
                borderRadius: 4,
                position: 'relative',
              }}
            >
              {category.image ? (
                <>
                  <img
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: 4,
                    }}
                    src={
                      category.image instanceof File
                        ? URL.createObjectURL(category.image)
                        : apiUrl + category.image
                    }
                    alt="Превью изображения"
                  />
                  <IconButton
                    onClick={deleteImageHandler}
                    size="small"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: theme.colors.white,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <Typography
                  component="span"
                  sx={{
                    color: theme.colors.DARK_GRAY,
                    fontSize: theme.fonts.size.xs,
                    textAlign: 'center',
                  }}
                >
                  Нет изображения
                </Typography>
              )}
            </Box>
          </Box>

          <Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.white,
                fontWeight: 500,
              }}
            >
              Добавить
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CategoryForm;
