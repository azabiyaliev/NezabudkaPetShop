import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { useEffect } from 'react';
import AdminBar from '../../../Admin/AdminProfile/AdminBar.tsx';
import products from '../../../Admin/Product/components/Products.tsx';
import Typography from '@mui/joy/Typography';
import ClientList from '../../components/ClientList/ClientList.tsx';
import {  getAllUserWithOrder } from '../../../../store/users/usersThunk.ts';
import {  selectUserWithCount } from '../../../../store/users/usersSlice.ts';
import { Box } from '@mui/material';

const ClientTable = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUserWithCount);

  useEffect(() => {
    dispatch(getAllUserWithOrder());
  }, [dispatch]);
  return (
    <div>
      <Box sx={{ display: "flex", margin: "30px 0" }}>
        <Box >
          <AdminBar />
        </Box>
        <Box>
          {products.length > 0 ? <ClientList clients={users} /> :  <Typography level="h2" sx={{ fontSize: 'xl', mb: 0.5 }}>
            Клиентов пока нет
          </Typography>
          }
        </Box>
      </Box>
    </div>
  );
};

export default ClientTable;