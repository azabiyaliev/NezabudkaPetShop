import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import AdminBar from '../../Admin/AdminProfile/AdminBar.tsx';
import Typography from '@mui/joy/Typography';
import { useEffect } from 'react';
import products from '../../Admin/Product/components/Products.tsx';
import AdminList from '../components/AdminList.tsx';
import { selectAdmins } from '../../../store/admins/adminSlice.ts';
import { getAdmins } from '../../../store/admins/adminThunks.ts';
import { Box } from '@mui/material';

const AdminTable = () => {
  const dispatch = useAppDispatch();
  const admins = useAppSelector(selectAdmins);

  useEffect(() => {
    dispatch(getAdmins());
  }, [dispatch]);

  return (
    <Box
      sx={{
      display: "flex",
      margin: "30px 0",
      "@media (max-width: 900px)": {
        flexWrap: "wrap",
        flexDirection: "column",
      },
    }}>

      <AdminBar/>
      <Box
        sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}>
        {products.length > 0 ? <AdminList admins={admins} /> :  <Typography level="h2" sx={{ fontSize: 'xl', mb: 0.5 }}>
          Админов пока нет
        </Typography>
        }
      </Box>
    </Box>
  );
};

export default AdminTable;