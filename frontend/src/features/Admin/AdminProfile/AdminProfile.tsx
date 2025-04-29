import AdminBar from "./AdminBar.tsx";
import { useAppSelector } from '../../../app/hooks.ts';
import { selectUser } from '../../../store/users/usersSlice.ts';
import { userRoleAdmin } from '../../../globalConstants.ts';
import OrderStats from '../AdminOrderPage/OrderStats.tsx';

const AdminProfile = () => {
  const user = useAppSelector(selectUser);

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
                <div>
                  <h6 style={{textAlign: 'center', marginTop: '20px'}}>
                    Info by super admin
                  </h6>
                </div>
              </div>
            </div> : <OrderStats/>
          }
        </>
      )}
    </>
  );
};

export default AdminProfile;
