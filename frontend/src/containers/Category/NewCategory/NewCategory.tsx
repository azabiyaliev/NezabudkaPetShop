import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import CategoryForm from '../../../components/CategoryForm/CategoryForm.tsx';
import { selectUser } from '../../../features/users/usersSlice.ts';
import { CategoryMutation } from '../../../types';
import {
  addNewCategory,
  fetchCategoriesThunk,
} from '../../../features/categories/categoriesThunk.ts';
import { toast, ToastContainer } from 'react-toastify';


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
      <CategoryForm onSubmit={onSubmit}/>
      <ToastContainer/>
    </>
  );
};

export default NewCategory;