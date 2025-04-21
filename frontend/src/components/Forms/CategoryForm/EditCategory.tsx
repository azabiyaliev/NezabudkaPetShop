import { TextField, Button, Box, Typography } from '@mui/material';
import React, { useCallback, useState } from "react";
import { CategoryMutation } from "../../../types";
import { selectUser } from '../../../store/users/usersSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import {
  addIconToCategoryThunk, addImageToCategoryThunk,
  fetchCategoriesThunk,
  updateCategoryThunk
} from '../../../store/categories/categoriesThunk.ts';
import { toast } from 'react-toastify';
import FileInputCategory from '../../FileInput/FileInputCategory.tsx';


interface EditCategoryProps {
  category: {
    id: number;
    title: string;
  };
  onClose: () => void;
  subcategoryId: number;
}

const WARNING_SELECT_CATEGORY = "Не оставляйте поля пустыми!!";
const SUCCESSFUL_CATEGORY_UPDATE = "Категория успешно обновлена!";

const EditCategory: React.FC<EditCategoryProps> = ({ category, onClose, subcategoryId }) => {
  const [editedCategory, setEditedCategory] = useState<CategoryMutation>({
    title: category.title,
  });
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [icon, setIcon] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedCategory.title.trim() === "") {
      toast.warning(WARNING_SELECT_CATEGORY, { position: 'top-center' });
      return;
    }

    if (!user) return;

    await dispatch(updateCategoryThunk({
      id: String(category.id),
      category: {
        title: editedCategory.title,
      },
      token: user.token,
    }));

    setEditedCategory((prevState) => ({
      ...prevState,
      title: editedCategory.title,
    }));


    if (icon || image) {
      if (icon) {
        await dispatch(addIconToCategoryThunk({ id: subcategoryId, iconFile: icon }));
      }

      if (image) {
        await dispatch(addImageToCategoryThunk({ id: subcategoryId, imageFile: image }));
      }
    }

    await dispatch(fetchCategoriesThunk());

    toast.success(SUCCESSFUL_CATEGORY_UPDATE, { position: 'top-center' });

    onClose();
  };

  const inputChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedCategory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);


  const fileEventChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;

    if (files && files[0]) {
      if (name === "icon") {
        setIcon(files[0]);
      } else if (name === "image") {
        setImage(files[0]);
      }
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
        mx: "auto",
      }}
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

      <Box sx={{ display: 'flex' , justifyContent: 'space-between', gap: '20px'}}>
        <Box>
          <Typography textAlign="left">
            Иконка категории
          </Typography>

          <FileInputCategory name="icon" label="Выберите иконку" onGetFile={fileEventChangeHandler}/>
        </Box>
        <Box>
          <Typography textAlign="left">
            Изображение категории
          </Typography>

          <FileInputCategory name="image" label="Выберите изображение" onGetFile={fileEventChangeHandler}/>
        </Box>
      </Box>

      <Button type="submit" variant="contained" sx={{ bgcolor: "#237803", color: "white" }}>
        Сохранить изменения
      </Button>
    </Box>
  );
};

export default EditCategory;
