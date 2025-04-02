import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import Grid from '@mui/material/Grid2';
import AdminBar from '../../Admin/AdminProfile/AdminBar.tsx';
import Typography from '@mui/joy/Typography';
import { useEffect } from 'react';
import products from '../../Admin/Product/components/Products.tsx';
import AdminList from '../components/AdminList.tsx';
import { selectAdmins } from '../../../store/admins/adminSlice.ts';
import { getAdmins } from '../../../store/admins/adminThunks.ts';

const AdminTable = () => {
  const dispatch = useAppDispatch();
  const admins = useAppSelector(selectAdmins);

  useEffect(() => {
    dispatch(getAdmins());
  }, [dispatch]);

  return (
    <Grid container spacing={2}>
      <Grid size={3}>
        <AdminBar/>
      </Grid>
      <Grid size={9}>
        {products.length > 0 ? <AdminList admins={admins} /> :  <Typography level="h2" sx={{ fontSize: 'xl', mb: 0.5 }}>
          Админов пока нет
        </Typography>
        }
      </Grid>
    </Grid>
  );
};

export default AdminTable;