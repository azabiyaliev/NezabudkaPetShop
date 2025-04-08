import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import AdminBar from '../../../Admin/AdminProfile/AdminBar.tsx';
import products from '../../../Admin/Product/components/Products.tsx';
import Typography from '@mui/joy/Typography';
import { selectUsers } from '../../../../store/users/usersSlice.ts';
import ClientList from '../../components/ClientList/ClientList.tsx';
import { getAllUser } from '../../../../store/users/usersThunk.ts';

const ClientTable = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);
  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={3}>
          <AdminBar/>
        </Grid>
        <Grid size={9}>
          {products.length > 0 ? <ClientList clients={users} /> :  <Typography level="h2" sx={{ fontSize: 'xl', mb: 0.5 }}>
            Клиентов пока нет
          </Typography>
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default ClientTable;