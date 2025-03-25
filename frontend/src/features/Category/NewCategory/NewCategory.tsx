import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import CategoryForm from '../../../components/Forms/CategoryForm/CategoryForm.tsx';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { CategoryMutation } from '../../../types';
import {
  addNewCategory,
  fetchCategoriesThunk,
} from '../../../store/categories/categoriesThunk.ts';
import { toast, ToastContainer } from 'react-toastify';
import AdminBar from '../../Admin/AdminProfile/AdminBar.tsx';
import { Box } from '@mui/material';


const NewCategory = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const onSubmit = async (category: CategoryMutation) => {
    if (user) {
      await dispatch(addNewCategory({category, token: user.token}));
      await dispatch(fetchCategoriesThunk());

      toast.success('Категория была добавлена ;)', {position: 'top-center'});
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0'}}>
        <AdminBar/>
        <CategoryForm onSubmit={onSubmit}/>
      </Box>
      <ToastContainer/>
    </>
  );
};

export default NewCategory;