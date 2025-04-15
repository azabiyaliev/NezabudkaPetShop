import { Box } from "@mui/material";
import AdminBar from "../../Admin/AdminProfile/AdminBar.tsx";
import ManageCategories from "../ManageCategories/ManageCategories.tsx";

const CategoryPage = () => {
  return (
    <Box sx={{ display: "flex", margin: "30px 0" }}>
      <AdminBar />
      <Box
        sx={{
          marginLeft: "20px",
        }}
      >
        <ManageCategories />
      </Box>
    </Box>
  );
};

export default CategoryPage;
