import { Box } from '@mui/material';
import AdminBar from "../../Admin/AdminProfile/AdminBar.tsx";
import ManageCategories from "../ManageCategories/ManageCategories.tsx";


const CategoryPage = () => {

  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        gap: 4,
        position: "relative",
        overflow: "hidden",
        "@media (max-width: 900px)": {
          flexWrap: "wrap",
          gap: 2,
        },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          height: "100%",
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
          alignItems: "center",
          ml: 2,
          "@media (max-width: 900px)": {
            marginTop: "30px",
            maxWidth: "100%",
            width: "100%",
          },
        }}
      >
        <ManageCategories />
      </Box>
    </Box>
  );
};

export default CategoryPage;
