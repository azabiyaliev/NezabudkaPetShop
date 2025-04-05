import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import {
  addNewSubcategory,
  fetchCategoriesThunk,
} from '../../../store/categories/categoriesThunk.ts';
import { toast, ToastContainer } from 'react-toastify';
import SubcategoryForm from '../../../components/Forms/SubcategoryForm/SubcategoryForm.tsx';
import { Box } from '@mui/material';
import AdminBar from '../../Admin/AdminProfile/AdminBar.tsx';


const ERROR_CATEGORY = "Ошибка при добавлении подкатегории!";

const NewSubcategory = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const onSubmit = async (id: number, subcategories: string[]) => {
    try {
      if (user) {
        await dispatch(addNewSubcategory({
          id,
          subcategories,
          token: user.token,
        }));

        await dispatch(fetchCategoriesThunk());

        toast.success('Подкатегория была добавлена ;)', { position: 'top-center' });
      }
    } catch (error) {
      console.log(error)
      toast.error(ERROR_CATEGORY, { position: 'top-center' });
    }
  };


  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0'}}>
        <AdminBar />
        <SubcategoryForm onSubmit={onSubmit} />
        <ToastContainer/>
      </Box>
    </>
  );
};

export default NewSubcategory;