import AdminBar from "./AdminBar.tsx";
import { useAppDispatch, useAppSelector, usePermission } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { userRoleAdmin } from '../../../globalConstants.ts';
import { selectAdminInfo } from '../../../store/adminInfo/adminInfoSlice.ts';
import { useEffect } from 'react';
import { fetchAdminInfo } from '../../../store/adminInfo/adminInfoThunk.ts';
import { Paper, Typography, Box } from '@mui/material';

const AdminProfile = () => {
  const user = useAppSelector(selectUser);
  const adminInfo = useAppSelector(selectAdminInfo);
  const dispatch = useAppDispatch();
  const can = usePermission(user);

  useEffect(() => {
    dispatch(fetchAdminInfo());
  }, [dispatch]);

  return (
    <>
      {user && can([userRoleAdmin]) && (
        <Box sx={{ display: "flex", margin: "30px 0" }}>
          <Box>
          <AdminBar />
          </Box>
          <Box sx={{ marginLeft: "20px" }}>
            <Paper sx={{ p: 3, mt: 2 }} elevation={2}>
              <Typography variant="body1" align="center">
                {adminInfo?.information || 'Информация отсутствует'}
              </Typography>
            </Paper>
          </Box>
        </Box>
      )}
    </>

  );
};

export default AdminProfile;
