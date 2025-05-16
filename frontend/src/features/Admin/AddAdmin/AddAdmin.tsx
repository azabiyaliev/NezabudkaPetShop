import { Box } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import AdminForm from '../../../components/Forms/AdminForm/AdminForm.tsx';

const AddAdmin = () => {
  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        "@media (max-width: 900px)": {
          flexWrap: "wrap",
          flexDirection: "column",
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
      <AdminForm/>
    </Box>
  );
};

export default AddAdmin;