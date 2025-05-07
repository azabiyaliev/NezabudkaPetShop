import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import CategoryForm from '../../../components/Forms/CategoryForm/CategoryForm.tsx';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { CategoryMutation } from '../../../types';
import {
  addNewCategory,
  fetchCategoriesThunk,
} from '../../../store/categories/categoriesThunk.ts';
import { Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';


const NewCategory = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const onSubmit = async (category: CategoryMutation) => {
    if (user) {
      await dispatch(addNewCategory({category, token: user.token}));
      await dispatch(fetchCategoriesThunk());
      enqueueSnackbar('Категория была добавлена!', { variant: 'success' });
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
        <CategoryForm onSubmit={onSubmit}/>
      </Box>
    </>
  );
};

export default NewCategory;