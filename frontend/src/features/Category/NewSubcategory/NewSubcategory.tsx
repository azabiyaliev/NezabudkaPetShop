import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import {
  addNewSubcategory,
  fetchCategoriesThunk,
} from '../../../store/categories/categoriesThunk.ts';
import { toast, ToastContainer } from 'react-toastify';
import SubcategoryForm from '../../../components/Forms/SubcategoryForm/SubcategoryForm.tsx';
import { Box } from '@mui/material';

const ERROR_SUBCATEGORY = "Ошибка при добавлении подкатегории!";
const SUCCESS_SUBCATEGORY = "Подкатегория была добавлена ;)";


const NewSubcategory = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const onSubmit = async (categoryId: number, subcategory: string[]) => {
    try {
      if (user) {
        await dispatch(addNewSubcategory({
          parentId: categoryId,
          subcategory,
          token: user.token,
        }));

        await dispatch(fetchCategoriesThunk());

        toast.success(SUCCESS_SUBCATEGORY, { position: 'top-center' });
      }
    } catch (error) {
      console.log(error)
      toast.error(ERROR_SUBCATEGORY, { position: 'top-center' });
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0'}}>
        <SubcategoryForm onSubmit={onSubmit}/>
        <ToastContainer/>
      </Box>
    </>
  );
};

export default NewSubcategory;