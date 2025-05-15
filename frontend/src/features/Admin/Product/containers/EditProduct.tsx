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
import { Box } from '@mui/material';
import theme from '../../../../globalStyles/globalTheme.ts';
import Typography from '@mui/joy/Typography';

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
      <Box
        sx={{
          flexShrink: 0,
          height: "100%",
          marginRight: 2,
          "@media (max-width: 900px)": {
            display: "none",
          },
        }}
      >
        <AdminBar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "70%",
            "@media (max-width: 900px)": {
              width: "100%",
              mt: 5,
            },
          }}
        >
        <Typography
          level="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: theme.fonts.weight.medium,
          }}
        >
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
    </Box>
  );
};

export default EditProduct;
