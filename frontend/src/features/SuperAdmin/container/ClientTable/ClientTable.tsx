import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import AdminBar from '../../../Admin/AdminProfile/AdminBar.tsx';
import products from '../../../Admin/Product/components/Products.tsx';
import Typography from '@mui/joy/Typography';
import ClientList from '../../components/ClientList/ClientList.tsx';
import {  getAllUserWithOrder } from '../../../../store/users/usersThunk.ts';
import {  selectUserWithCount } from '../../../../store/users/usersSlice.ts';

const ClientTable = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUserWithCount);

  useEffect(() => {
    dispatch(getAllUserWithOrder());
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