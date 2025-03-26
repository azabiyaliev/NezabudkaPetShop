import {
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectAllSubcategories, selectCategories, selectLoading } from '../../../store/categories/categoriesSlice.ts';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchSubcategories } from '../../../store/categories/categoriesThunk.ts';

export interface Props {
  onSubmit: (id: number, subcategories: string[]) => void;
}

const SubcategoryForm: React.FC<Props> = ({ onSubmit }) => {
  const categories = useAppSelector(selectCategories);
  const allSubcategories = useAppSelector(selectAllSubcategories);
  const isLoading = useAppSelector(selectLoading);
  const [parentId, setParentId] = useState<number | null>(null);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState('');
  const dispatch = useAppDispatch();

  const predefinedSubcategories = [
    'Амуниция',
    'Ветеринарная аптека',
    'Витамины и добавки',
    'Влажный корм',
    'Сухой корм',
    'Домики и лежанки',
    'Ошейники и шлейки',
    'Лакомства',
    'Игрушки',
    'Сено',
  ];

  useEffect(() => {
    if (parentId) {
      console.log("Fetching subcategories for:", parentId);
      dispatch(fetchSubcategories(parentId));
    }
  }, [parentId, dispatch]);


  console.log(allSubcategories);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!parentId) {
      return toast.warning('Выберите родительскую категорию!');
    }

    if (subcategories.length === 0) {
      return toast.warning('Выберите хотя бы одну подкатегорию!');
    }

    onSubmit(parentId, subcategories);
    setSubcategories([]);
  };

  const handleSelectParentChange = (e: SelectChangeEvent<string>) => {
    setParentId(Number(e.target.value));
  };

  const handleSelectSubcategoriesChange = (e: SelectChangeEvent<string[]>) => {
    setSubcategories(e.target.value as string[]);
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() === '') {
      return toast.warning('Введите название подкатегории!');
    }

    if (subcategories.includes(newSubcategory)) {
      return toast.warning('Эта подкатегория уже выбрана!');
    }

    setSubcategories((prev) => [...prev, newSubcategory]);
    setNewSubcategory('');
  };

  const availableSubcategories = [
    ...predefinedSubcategories,
    ...allSubcategories.map((sub) => sub.title),
  ];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800, mx: 'auto', mt: 4, p: 4, border: '1px solid #ccc', borderRadius: 2, boxShadow: 2 }}
    >
      <Typography variant="h6" textAlign="center">
        Добавить подкатегорию
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Родительская категория</InputLabel>
        <Select
          value={parentId ? String(parentId) : ''}
          onChange={handleSelectParentChange}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Подкатегории</InputLabel>
        <Select
          multiple
          value={subcategories}
          onChange={handleSelectSubcategoriesChange}
          renderValue={(selected) => selected.join(', ')}
        >
          {availableSubcategories.map((sub) => (
            <MenuItem key={sub} value={sub}>
              {sub}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          fullWidth
          label="Добавить новую подкатегорию"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
        />
        <Button onClick={handleAddSubcategory} variant="outlined">
          Добавить
        </Button>
      </Box>

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
  );
};

export default SubcategoryForm;
