import { TextField, Button, Box, Typography } from '@mui/material';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import {
  fetchCategoriesThunk,
  updateCategoryThunk
} from '../../../store/categories/categoriesThunk.ts';
import { toast } from 'react-toastify';
import FileInputCategory from '../../FileInput/FileInputCategory.tsx';
import FileInputForBrand from '../../Domain/Brand/FileInputForBrand/FileInputForBrand.tsx';

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

  const [iconPreview, setIconPreview] = useState<string | null>(category.icon || null);
  const [imagePreview, setImagePreview] = useState<string | null>(category.image || null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk())
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedCategory.title.trim()) {
      toast.warning("Не оставляйте поля пустыми!!", { position: 'top-center' });
      return;
    }

    if (!user) return;

    try {
      await dispatch(updateCategoryThunk({
        id: String(category.id),
        category: {
          title: editedCategory.title,
          icon: editedCategory.icon instanceof File ? editedCategory.icon : undefined,
          image: editedCategory.image instanceof File ? editedCategory.image : undefined,
        },
        token: user.token,
      }));

      await dispatch(fetchCategoriesThunk());

      toast.success("Категория успешно обновлена!", { position: 'top-center' });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при обновлении категории!", { position: 'top-center' });
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

    if (name === 'icon') {
      setIconPreview(URL.createObjectURL(file));
    } else if (name === 'image') {
      setImagePreview(URL.createObjectURL(file));
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

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {iconPreview && (
            <img src={iconPreview} alt="icon preview" width="40" height="40" style={{ objectFit: 'cover' }} />
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
          {imagePreview && (
            <img src={imagePreview} alt="image preview" width="40" height="40" style={{ objectFit: 'cover' }} />
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
