import AdminBar from "./AdminBar.tsx";
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { userRoleAdmin } from '../../../globalConstants.ts';
import OrderStats from '../AdminOrderPage/OrderStats.tsx';
import { selectAdminInfo } from '../../../store/adminInfo/adminInfoSlice.ts';
import { useEffect } from 'react';
import { fetchAdminInfo } from '../../../store/adminInfo/adminInfoThunk.ts';
import { Paper, Typography } from '@mui/material';

const AdminProfile = () => {
  const user = useAppSelector(selectUser);
  const adminInfo = useAppSelector(selectAdminInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAdminInfo());
  }, [dispatch]);

  return (
    <>
      {user && (
        <>
          {user.role === userRoleAdmin ?
            <div className="d-flex ">
              <div className="col-3 ">
                <AdminBar/>
              </div>
              <div className="col-9">
                <h2 className="text-uppercase text-center mt-4">Личный кабинет</h2>
                <Paper sx={{ p: 3, mt: 2 }} elevation={2}>
                  <Typography variant="body1" align="center">
                    {adminInfo?.information || 'Информация отсутствует'}
                  </Typography>
                </Paper>
              </div>
            </div> : <OrderStats/>
          }
        </>
      )}
    </>
  );
};

export default AdminProfile;
