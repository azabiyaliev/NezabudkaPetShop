import AdminBar from "./AdminBar.tsx";
import { useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { userRoleAdmin } from '../../../globalConstants.ts';
import { Box, Typography } from '@mui/material';

const AdminProfile = () => {
  const user = useAppSelector(selectUser);
  const can = usePermission(user);

  return (
    <>
      {user && can([userRoleAdmin]) && (
        <Box sx={{ display: "flex", margin: "30px 0" }}>
          <Box>
          <AdminBar />
          </Box>
          <Box sx={{ marginLeft: "20px" }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600, mt:3 }}>
              Личный кабинет
            </Typography>
          </Box>
        </Box>
      )}
    </>

  );
};

export default AdminProfile;
