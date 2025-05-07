import { useAppDispatch, useAppSelector, usePermission } from '../../../../app/hooks.ts';
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../../../store/products/productsThunk.ts";
import { ProductRequest } from "../../../../types";
import ProductForm from "../components/ProductForm.tsx";
import { selectUser } from "../../../../store/users/usersSlice.ts";
import AdminBar from "../../AdminProfile/AdminBar.tsx";
import { userRoleAdmin, userRoleSuperAdmin } from '../../../../globalConstants.ts';
import { Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

const NewProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  const onSubmitForm = async (product: ProductRequest) => {
    try {
      if (user && can([userRoleAdmin, userRoleSuperAdmin])) {
        await dispatch(addProduct({ product, token: user.token })).unwrap();
        enqueueSnackbar('Товар успешно добавлен!', { variant: 'success' });
        navigate("/private/products");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
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
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ml: 2,
            }}
          >
            <ProductForm onSubmit={onSubmitForm} />
          </Box>
        </Box>
    </>
  );
};

export default NewProduct;
