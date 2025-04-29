import { Box } from '@mui/material';
import BrandForm from '../../../components/Forms/BrandForm/BrandForm.tsx';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import { IBrandForm } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { addBrand } from '../../../store/brands/brandsThunk.ts';
import { addErrorFromSlice, addLoadingFromSlice } from '../../../store/brands/brandsSlice.ts';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { userRoleAdmin, userRoleSuperAdmin } from '../../../globalConstants.ts';

const NewBrandPage = () => {
  const user = useAppSelector(selectUser);
  const addError = useAppSelector(addErrorFromSlice);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(addLoadingFromSlice);
  const navigate = useNavigate();

  const addNewBrand = async (brand: IBrandForm) => {
    if (user && (user.role === userRoleAdmin || user.role === userRoleSuperAdmin)) {
      await dispatch(addBrand({ brand, token: user.token })).unwrap();
      enqueueSnackbar("Бренд успешно создан!", { variant: 'success' });
      navigate("/private/brands");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
      }}
    >
      <AdminBar />
      <BrandForm addNewBrand={addNewBrand} isLoading={loading} brandError={addError} />
    </Box>
  );
};

export default NewBrandPage;
