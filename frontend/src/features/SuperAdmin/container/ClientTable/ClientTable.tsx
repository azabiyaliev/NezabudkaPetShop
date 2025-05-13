import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { useEffect } from 'react';
import AdminBar from '../../../Admin/AdminProfile/AdminBar.tsx';
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
      <Box sx={{ display: "flex", margin: "30px 0",
        "@media (max-width: 1300px)": {
          flexDirection: "column",
        },
      }}>
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
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          {users.length > 0 ? (
            <Box sx={{ width: "90%", maxWidth: 1100 }}>
              <ClientList clients={users} />
            </Box>
          ) : (
            <Typography level="h2" sx={{ fontSize: 'xl', mb: 0.5 }}>
              Клиентов пока нет
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default ClientTable;