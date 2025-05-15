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

import theme from '../../../../globalStyles/globalTheme.ts';
import Typography from '@mui/joy/Typography';

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
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        "@media (max-width: 900px)": {
          flexDirection: "column",
        },
      }}
    >
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
            Добавление нового товара
          </Typography>
          <ProductForm onSubmit={onSubmitForm} />
        </Box>
      </Box>
    </Box>


  );
};

export default NewProduct;
