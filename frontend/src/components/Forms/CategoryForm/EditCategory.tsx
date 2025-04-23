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

interface EditCategoryProps {
  category: {
    id: number;
    title: string;
    icon?: string;  // Строка или URL для иконки
    image?: string; // Строка или URL для изображения
  };
  onClose: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ category, onClose }) => {
  const [editedCategory, setEditedCategory] = useState<{
    title: string;
    icon: File | string | null;  // icon может быть строкой, файлом или null
    image: File | string | null; // image может быть строкой, файлом или null
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
    setEditedCategory({
      title: category.title,
      icon: category.icon || null,
      image: category.image || null
    });

    if (category.icon) setIconPreview(category.icon);  // Для предпросмотра иконки
    if (category.image) setImagePreview(category.image); // Для предпросмотра изображения
  }, [category]);

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
          icon: editedCategory.icon,
          image: editedCategory.image
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

  // Обрабатываем изменения файлов
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setEditedCategory(prev => ({
        ...prev,
        [name]: file,
      }));

      const previewURL = URL.createObjectURL(file);
      if (name === 'icon') setIconPreview(previewURL);
      if (name === 'image') setImagePreview(previewURL);
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
            id="icon"
            name="icon"
            label="Выберите иконку"
            onGetFile={onFileChange}
            file={editedCategory.icon instanceof File ? editedCategory.icon : null}  // Отправляем только File для компонента
            inputRef={iconInputRef}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {imagePreview && (
            <img src={imagePreview} alt="image preview" width="40" height="40" style={{ objectFit: 'cover' }} />
          )}
          <FileInputCategory
            id="image"
            name="image"
            label="Выберите изображение"
            onGetFile={onFileChange}
            file={editedCategory.image instanceof File ? editedCategory.image : null}  // Отправляем только File для компонента
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
