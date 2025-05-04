import { Box } from "@mui/material";
import AdminBar from "../../Admin/AdminProfile/AdminBar.tsx";
import ManageCategories from "../ManageCategories/ManageCategories.tsx";

const CategoryPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        "@media (max-width: 900px)": {
          flexWrap: "wrap",
        },
      }}
    >
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
        <ManageCategories />
      </Box>
    </Box>
  );
};

export default CategoryPage;
