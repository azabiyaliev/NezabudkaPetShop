import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import AdminBar from '../../Admin/AdminProfile/AdminBar.tsx';
import Typography from '@mui/joy/Typography';
import { useEffect } from 'react';
import { selectAdmins } from '../../../store/admins/adminSlice.ts';
import { getAdmins } from '../../../store/admins/adminThunks.ts';
import { Box } from '@mui/material';
import { SPACING } from '../../../globalStyles/stylesObjects.ts';
import AdminList from '../components/AdminList.tsx';

const AdminTable = () => {
  const dispatch = useAppDispatch();
  const admins = useAppSelector(selectAdmins);

  useEffect(() => {
    dispatch(getAdmins());
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex", margin: "30px 0",
      "@media (max-width: 1300px)": {
        flexDirection: "column",
      },
    }}>
      <Box sx={{
        minWidth: 240,
        "@media (max-width: 1300px)": {
          width: "100%",
          minWidth: "100%",
        },
      }}>
        <AdminBar />
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        {admins.length > 0 ? (
          <Box sx={{ width: "90%", maxWidth: 1100, mt: SPACING.md }}>
            <AdminList admins={admins}/>
          </Box>
        ) : (
          <Typography level="h2" sx={{ fontSize: 'xl', mb: 0.5 }}>
            Админов пока нет
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AdminTable;