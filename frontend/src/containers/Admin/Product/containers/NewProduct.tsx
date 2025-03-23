import { useAppDispatch, useAppSelector } from "../../../../app/hooks.ts";
import { useNavigate } from "react-router-dom";
import { addProductLoading } from "../../../../features/products/productsSlice.ts";
import { addProduct } from "../../../../features/products/productsThunk.ts";
import { ProductRequest } from "../../../../types";
import { toast } from "react-toastify";
import { Box, CircularProgress } from "@mui/material";
import ProductForm from "../components/ProductForm.tsx";
import { selectUser } from "../../../../features/users/usersSlice.ts";
import AdminBar from "../../../../components/Admin/AdminBar.tsx";

const NewProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(addProductLoading);
  const user = useAppSelector(selectUser);

  const onSubmitForm = async (product: ProductRequest) => {
    try {
      if (user && user.role === "admin") {
        await dispatch(addProduct({ product, token: user.token })).unwrap();
        toast.success("Товар успешно добавлен!");
        navigate("/private/");
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0'}}>
          <AdminBar/>
          <ProductForm onSubmit={onSubmitForm} />
        </Box>
      )}
    </>
  );
};

export default NewProduct;
