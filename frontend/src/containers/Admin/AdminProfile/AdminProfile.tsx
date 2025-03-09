import AdminBar from './AdminBar.tsx';
import AdminForm from './AdminForm.tsx';

const AdminProfile = () => {
  return (
   <div>
     <h2 className="text-uppercase text-center mt-5">Личный кабинет</h2>
     <div className="d-flex ">
       <div className="col-3 mt-5 ">
         <AdminBar/>
       </div>
       <div className="col-9">
         <AdminForm />
       </div>
     </div>
   </div>
  );
};

export default AdminProfile;
