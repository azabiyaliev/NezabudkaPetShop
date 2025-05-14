import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchCategoriesThunk, updateCategoryThunk } from '../../../store/categories/categoriesThunk.ts';
import FileInputCategory from '../../FileInput/FileInputCategory.tsx';
import { apiUrl } from '../../../globalConstants.ts';
import CloseIcon from '@mui/icons-material/Close';
import { enqueueSnackbar } from 'notistack';
import theme from '../../../globalStyles/globalTheme.ts';

interface EditCategoryProps {
  category: {
    id: number;
    title: string;
    icon?: string;
    image?: string;
  };
  onClose: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ category, onClose }) => {
  const [editedCategory, setEditedCategory] = useState<{
    title: string;
    image: File | string | null;
  }>({
    title: category.title,
    image: category.image || null,
  });

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedCategory.title.trim()) {
      return enqueueSnackbar('Не оставляйте поля пустыми!', { variant: 'error' });
    }

    if (!user) return;

    try {
      const updatedCategoryData: {
        title: string;
        image?: File | null;
      } = {
        title: editedCategory.title,
      };

      if (editedCategory.image instanceof File) {
        updatedCategoryData.image = editedCategory.image;
      } else if (editedCategory.image === null && category.image) {
        updatedCategoryData.image = null;
      }

      await dispatch(
        updateCategoryThunk({
          id: String(category.id),
          category: updatedCategoryData,
          token: user.token,
        })
      );
      enqueueSnackbar('Вы успешно отредактировали категорию!', { variant: 'success' });
      await dispatch(fetchCategoriesThunk());
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Ошибка при обновлении категории!', { variant: 'error' });
    }
  };
  const inputChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCategory(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const fileInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (!files || files.length === 0) return;

    const file = files[0];

    setEditedCategory((prevState) => ({
      ...prevState,
      [name]: file,
    }));
  };


  const deletePhotoImage = () => {
    setEditedCategory({
      ...editedCategory,
      image: null,
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mx: "auto",  }}
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 , justifyContent: "space-evenly"}}>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              backgroundColor: theme.colors.rgbaGrey,
              border: `1px dashed ${theme.colors.DARK_GRAY}`,
              borderRadius: 4,
              position: "relative",
            }}
          >
            {editedCategory.image ? (
              <Box sx={{ display: "flex" }}>
                <>
                  <img
                    style={{
                      width: "100px",
                      height: "100px",
                      display: "block",
                      objectFit: "contain",
                    }}
                    src={
                      editedCategory.image instanceof File
                        ? URL.createObjectURL(editedCategory.image)
                        : apiUrl + editedCategory.image
                    }
                    alt={editedCategory.title}
                  />
                  <IconButton
                    onClick={deletePhotoImage}
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: theme.colors.white,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              </Box>
            ) : (
              <Typography
                component="span"
                sx={{
                  color: theme.colors.DARK_GRAY,
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                Нет изображения
              </Typography>
            )}
          </Box>

          <FileInputCategory
            name="image"
            label="Выберите изображение"
            onGetFile={fileInputChangeHandler}
            file={editedCategory.image !== null ? editedCategory.image : ""}
            id="image"
            inputRef={imageInputRef}
          />
        </Box>
      </Box>

      <Button
        type="submit"
        variant="contained"
        sx={{ bgcolor: "#237803", color: "white" }}
      >
        Сохранить изменения
      </Button>
    </Box>
  );
};

export default EditCategory;
