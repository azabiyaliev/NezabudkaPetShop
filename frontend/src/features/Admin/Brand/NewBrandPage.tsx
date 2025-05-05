import { Box, Typography } from '@mui/material';
import BrandForm from '../../../components/Forms/BrandForm/BrandForm.tsx';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import { IBrandForm } from '../../../types';
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { addBrand } from '../../../store/brands/brandsThunk.ts';
import { addErrorFromSlice, addLoadingFromSlice } from '../../../store/brands/brandsSlice.ts';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { userRoleAdmin, userRoleSuperAdmin } from '../../../globalConstants.ts';
import { FONTS, SPACING } from '../../../globalStyles/stylesObjects.ts';

const NewBrandPage = () => {
  const user = useAppSelector(selectUser);
  const addError = useAppSelector(addErrorFromSlice);
  const can = usePermission(user);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(addLoadingFromSlice);
  const navigate = useNavigate();

  const addNewBrand = async (brand: IBrandForm) => {
    if (user && (can([userRoleAdmin, userRoleSuperAdmin]))) {
      await dispatch(addBrand({ brand, token: user.token })).unwrap();
      enqueueSnackbar("Бренд успешно создан!", { variant: 'success' });
      navigate("/private/brands");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px auto",
        "@media (max-width: 900px)": {
          flexWrap: "wrap",
        },
      }}
    >
      <AdminBar />
      <Box sx={{
        textAlign: 'center', width: '100%',
      }}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{textAlign: 'center', margin: `${SPACING.md} 0 ${SPACING.lg} 0`, fontWeight: FONTS.weight.bold, fontSize: FONTS.size.xl}}>
            Добавление нового бренда
          </Typography>
          <BrandForm addNewBrand={addNewBrand} isLoading={loading} brandError={addError}/>
        </Box>
      </Box>
    </Box>
  );
};

export default NewBrandPage;
