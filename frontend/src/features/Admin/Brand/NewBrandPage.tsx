import { Box } from "@mui/material";
import BrandForm from "../../../components/Forms/BrandForm/BrandForm.tsx";
import AdminBar from "../AdminProfile/AdminBar.tsx";
import { IBrandForm } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import { addBrand } from "../../../store/brands/brandsThunk.ts";
import { toast } from "react-toastify";
import { addLoadingFromSlice } from "../../../store/brands/brandsSlice.ts";
import { useNavigate } from "react-router-dom";

const NewBrandPage = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(addLoadingFromSlice);
  const navigate = useNavigate();

  const addNewBrand = async (brand: IBrandForm) => {
    if (user && user.role === "admin") {
      await dispatch(addBrand({ brand, token: user.token })).unwrap();
      toast.success("Бренд успешно создан!");
      navigate("/private/brands");
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
      <BrandForm addNewBrand={addNewBrand} isLoading={loading} />
    </Box>
  );
};

export default NewBrandPage;
