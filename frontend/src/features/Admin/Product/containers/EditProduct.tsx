import { useAppDispatch, useAppSelector, usePermission } from '../../../../app/hooks.ts';
import { useNavigate, useParams } from "react-router-dom";
import {
  addProductLoading,
  selectProduct,
} from "../../../../store/products/productsSlice.ts";
import { selectUser } from "../../../../store/users/usersSlice.ts";
import { ProductRequest } from "../../../../types";
import {
  editProduct,
  getOneProductForEdit,
} from '../../../../store/products/productsThunk.ts';
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AdminBar from "../../AdminProfile/AdminBar.tsx";
import ProductForm from "../components/ProductForm.tsx";
import { useEffect } from "react";
import { userRoleAdmin, userRoleSuperAdmin } from '../../../../globalConstants.ts';

const EditProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(addProductLoading);
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
        toast.success("Товар успешно обновлен!");
        navigate("/private/products");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid size={3}>
            <AdminBar />
          </Grid>
          <Grid size={9}>
            {product !== null && (
              <ProductForm
                onSubmit={onSubmitForm}
                editProduct={product}
                isProduct
              />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default EditProduct;
