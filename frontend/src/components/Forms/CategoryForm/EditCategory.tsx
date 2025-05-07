import { TextField, Button, Box, Typography } from '@mui/material';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchCategoriesThunk, updateCategoryThunk } from '../../../store/categories/categoriesThunk.ts';
import FileInputCategory from '../../FileInput/FileInputCategory.tsx';
import { apiUrl } from '../../../globalConstants.ts';
import CloseIcon from '@mui/icons-material/Close';
import { enqueueSnackbar } from 'notistack';

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
    icon: File | string | null;
    image: File | string | null;
  }>({
    title: category.title,
    icon: category.icon || null,
    image: category.image || null,
  });

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const iconInputRef = useRef<HTMLInputElement | null>(null);
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
        icon?: File | null;
        image?: File | null;
      } = {
        title: editedCategory.title,
      };

      if (editedCategory.icon instanceof File) {
        updatedCategoryData.icon = editedCategory.icon;
      } else if (editedCategory.icon === null && category.icon) {
        updatedCategoryData.icon = null;
      }

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
      enqueueSnackbar('Вы успешно отредактировли !', { variant: 'success' });
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

  const deletePhotoIcon = () => {
    setEditedCategory({
      ...editedCategory,
      icon: null,
    });
    if (iconInputRef.current) {
      iconInputRef.current.value = '';
    }
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
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mx: "auto" }}>
      <Typography variant="h6" textAlign="center">Редактировать категорию</Typography>

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {editedCategory.icon && (
            <Box sx={{ display: "flex" }}>
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  textIndent: "-9999px",
                  display: "block",
                  objectFit: "contain",
                }}
                src={
                  editedCategory.icon instanceof File
                    ? URL.createObjectURL(editedCategory.icon)
                    : apiUrl + editedCategory.icon
                }
                alt={editedCategory.title}
              />
              <CloseIcon onClick={deletePhotoIcon} />
            </Box>
          )}
          <FileInputCategory
            name="icon"
            label="Выберите иконку"
            onGetFile={fileInputChangeHandler}
            file={editedCategory.icon !== null ? editedCategory.icon : ""}
            id="icon"
            inputRef={iconInputRef}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {editedCategory.image && (
            <Box sx={{ display: "flex" }}>
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  textIndent: "-9999px",
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
              <CloseIcon onClick={deletePhotoImage} />
            </Box>
          )}
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

      <Button type="submit" variant="contained" sx={{ bgcolor: "#237803", color: "white" }}>
        Сохранить изменения
      </Button>
    </Box>
  );
};

export default EditCategory;
