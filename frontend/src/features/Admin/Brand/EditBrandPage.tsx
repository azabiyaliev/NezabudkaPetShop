import { Box, Typography } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import BrandForm from '../../../components/Forms/BrandForm/BrandForm.tsx';
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import {
  brandFromSlice,
  clearBrand,
  editErrorFromSlice,
  editLoadingFromSlice,
} from '../../../store/brands/brandsSlice.ts';
import { IBrandForm } from '../../../types';
import { useEffect } from 'react';
import { editBrand, getOneBrand } from '../../../store/brands/brandsThunk.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { userRoleAdmin, userRoleSuperAdmin } from '../../../globalConstants.ts';
import { FONTS, SPACING } from '../../../globalStyles/stylesObjects.ts';

const EditBrandPage = () => {
  const user = useAppSelector(selectUser);
  let brand = useAppSelector(brandFromSlice);
  const editError = useAppSelector(editErrorFromSlice);
  const can = usePermission(user);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(editLoadingFromSlice);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(clearBrand());
      dispatch(getOneBrand(Number(id))).unwrap();
    }
  }, [dispatch, id]);

  if (brand && brand.description === null) {
    brand = { ...brand, description: "" };
  }

  const addNewBrand = async (newBrand: IBrandForm) => {
    if (user && (can([userRoleAdmin, userRoleSuperAdmin]))) {
      if (id) {
        await dispatch(
          editBrand({ token: user.token, brand: newBrand }),
        ).unwrap();
        enqueueSnackbar("Бренд успешно отредактирован!", { variant: 'success' });
        navigate("/private/brands");
      }
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
            Редактирование бренда
          </Typography>
          {brand !== null && (
            <BrandForm
              addNewBrand={addNewBrand}
              isLoading={loading}
              editBrand={brand}
              isBrand
              brandError={editError}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EditBrandPage;
