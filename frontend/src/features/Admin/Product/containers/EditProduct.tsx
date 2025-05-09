import { useAppDispatch, useAppSelector, usePermission } from '../../../../app/hooks.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { selectProduct } from '../../../../store/products/productsSlice.ts';
import { selectUser } from '../../../../store/users/usersSlice.ts';
import { ProductRequest } from '../../../../types';
import { editProduct, getOneProductForEdit, } from '../../../../store/products/productsThunk.ts';
import AdminBar from '../../AdminProfile/AdminBar.tsx';
import ProductForm from '../components/ProductForm.tsx';
import { useEffect } from 'react';
import { userRoleAdmin, userRoleSuperAdmin } from '../../../../globalConstants.ts';
import { enqueueSnackbar } from 'notistack';
import { Box, Typography } from '@mui/material';

const EditProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const product = useAppSelector(selectProduct);
  const { id } = useParams();
  const can = usePermission(user);
  useEffect(() => {
    if (id) dispatch(getOneProductForEdit(Number(id))).unwrap();
  }, [dispatch, id]);

  const onSubmitForm = async (newProduct: ProductRequest) => {
    try {
      if (user && can([userRoleAdmin, userRoleSuperAdmin])) {
        await dispatch(
          editProduct({ token: user.token, product: newProduct }),
        ).unwrap();
        enqueueSnackbar('Товар успешно обновлен!', { variant: 'success' });
        navigate("/private/products");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        "@media (max-width: 900px)": {
          flexWrap: "wrap",
        },
      }}>
      <AdminBar />
      <Box
        sx={{
          width: '100%',
          marginLeft: '30px',
          "@media (max-width: 900px)": {
            marginLeft: '0',
          },
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600}}>
          Редактирование товара
        </Typography>
        {product !== null && (
          <ProductForm
            onSubmit={onSubmitForm}
            editProduct={{
              ...product,
              categoryId: product.productCategory?.map((pc) => pc.category?.id).filter((id): id is number => typeof id === 'number') ?? [],
            }}
            isProduct
          />
        )}
      </Box>
    </Box>
  );
};

export default EditProduct;
