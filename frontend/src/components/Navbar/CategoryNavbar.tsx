import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const CategoryNavbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, rgba(250, 134, 1, 1) 0%, rgba(250, 179, 1, 1) 28%, rgba(250, 143, 1, 1) 100%)",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Категории
          </Typography>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default CategoryNavbar;