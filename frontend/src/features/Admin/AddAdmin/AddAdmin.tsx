import { Box } from '@mui/material';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import AdminForm from '../../../components/Forms/AdminForm/AdminForm.tsx';

const AddAdmin = () => {
  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
      }}
    >
      <AdminBar />
      <AdminForm/>
    </Box>
  );
};

export default AddAdmin;