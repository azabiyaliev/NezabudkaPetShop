import { useAppDispatch, useAppSelector } from "../../../../app/hooks.ts";
import { useNavigate, useParams } from "react-router-dom";
import {
  addProductLoading,
  selectProduct,
} from "../../../../store/products/productsSlice.ts";
import { selectUser } from "../../../../store/users/usersSlice.ts";
import { ProductRequest } from "../../../../types";
import {
  editProduct,
  getOneProduct,
} from "../../../../store/products/productsThunk.ts";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AdminBar from "../../AdminProfile/AdminBar.tsx";
import ProductForm from "../components/ProductForm.tsx";
import { useEffect } from "react";

const EditProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(addProductLoading);
  const user = useAppSelector(selectUser);
  const product = useAppSelector(selectProduct);
  const { id } = useParams();

  useEffect(() => {
    if (id) dispatch(getOneProduct(Number(id))).unwrap();
  }, [dispatch, id]);

  const onSubmitForm = async (newProduct: ProductRequest) => {
    try {
      console.log('Submitting product data:', newProduct);
      if (user && user.role === "admin") {
        await dispatch(editProduct({ token: user.token, product: newProduct, })).unwrap();
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
