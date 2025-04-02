import { Box } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import BrandForm from '../../../components/Forms/BrandForm/BrandForm.tsx';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { brandFromSlice, editErrorFromSlice, editLoadingFromSlice, } from '../../../store/brands/brandsSlice.ts';
import { IBrandForm } from '../../../types';
import { useEffect } from 'react';
import { editBrand, getOneBrand } from '../../../store/brands/brandsThunk.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditBrandPage = () => {
  const user = useAppSelector(selectUser);
  const brand = useAppSelector(brandFromSlice);
  const editError = useAppSelector(editErrorFromSlice);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(editLoadingFromSlice);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getOneBrand(Number(id))).unwrap();
    }
  }, [dispatch, id]);

  const addNewBrand = async (newBrand: IBrandForm) => {
    console.log(newBrand);
    if (user) {
      if (id) {
        await dispatch(
          editBrand({ token: user.token, brand: newBrand }),
        ).unwrap();
        toast.success("Бренд успешно отредактирован!");
        navigate("/private/brands");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "30px 0",
      }}
    >
      <AdminBar />
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
  );
};

export default EditBrandPage;
