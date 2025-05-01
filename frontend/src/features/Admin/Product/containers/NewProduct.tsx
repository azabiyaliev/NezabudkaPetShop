import { useAppDispatch, useAppSelector, usePermission } from '../../../../app/hooks.ts';
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../../../store/products/productsThunk.ts";
import { ProductRequest } from "../../../../types";
import { toast } from "react-toastify";
import ProductForm from "../components/ProductForm.tsx";
import { selectUser } from "../../../../store/users/usersSlice.ts";
import Grid from "@mui/material/Grid2";
import AdminBar from "../../AdminProfile/AdminBar.tsx";
import { userRoleAdmin, userRoleSuperAdmin } from '../../../../globalConstants.ts';

const NewProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  const onSubmitForm = async (product: ProductRequest) => {
    try {
      if (user && can([userRoleAdmin, userRoleSuperAdmin])) {
        await dispatch(addProduct({ product, token: user.token })).unwrap();
        toast.success("Товар успешно добавлен!");
        navigate("/private/products");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
        <Grid container spacing={2}>
          <Grid size={3}>
            <AdminBar />
          </Grid>
          <Grid size={9}>
            <ProductForm onSubmit={onSubmitForm} />
          </Grid>
        </Grid>
    </>
  );
};

export default NewProduct;
