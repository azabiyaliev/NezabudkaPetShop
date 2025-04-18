import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from 'react';
import FileInput from '../../FileInput/FileInput.tsx';
import { addIconToCategoryThunk, fetchCategoriesThunk } from '../../../store/categories/categoriesThunk.ts';
import { useAppDispatch } from '../../../app/hooks.ts';

interface Props {
  onClose: () => void;
  subcategoryId: number;
}

const CategoryIcons: React.FC<Props> = ({onClose, subcategoryId}) => {
  const [icon, setIcon] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (icon) {

      dispatch(addIconToCategoryThunk({ id: subcategoryId, iconFile: icon }))
        .then(() => {
          dispatch(fetchCategoriesThunk());
          onClose();
        });
    }
    onClose();
  };

  const fileEventChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      setIcon(files[0]);
    }
  };


  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          maxWidth: 400,
          width: '100%',
          mx: "auto",
        }}
      >
        <Typography variant="h6" textAlign="left">
          Добавить иконку
        </Typography>

        <Box>
          <FileInput
            name="categoryIcon"
            label="Выберите иконку"
            onGetFile={fileEventChangeHandler}
          />
        </Box>

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
    </>
  );
};

export default CategoryIcons;