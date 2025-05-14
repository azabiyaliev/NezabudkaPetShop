import { Box, Drawer, IconButton } from '@mui/material';
import AdminBar from "../../Admin/AdminProfile/AdminBar.tsx";
import ManageCategories from "../ManageCategories/ManageCategories.tsx";
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import  { useState } from 'react';
import ModalClose from '@mui/joy/ModalClose';

const CategoryPage = () => {
  const [isAdminBarOpen, setIsAdminBarOpen] = useState(false);

  const toggleAdminBar = () => setIsAdminBarOpen(!isAdminBarOpen);
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
      <IconButton
        onClick={toggleAdminBar}
        sx={{
          position: "absolute",
          top: -15,
          left: 0,
          display: "block",
          zIndex: 10,
          "@media (min-width: 900px)": {
            display: "none",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={isAdminBarOpen}
        onClose={toggleAdminBar}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400,
            "@media (max-width: 400px)": {
              width: 330,
            },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Панель админа
          </Typography>
          <AdminBar />
          <ModalClose onClick={toggleAdminBar} />
        </Box>
      </Drawer>

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
