import AdminBar from '../../../components/Admin/AdminBar.tsx';

const AdminProfile = () => {
  return (
   <div>
     <h2 className="text-uppercase text-center mt-5">Личный кабинет</h2>
     <div className="d-flex ">
       <div className="col-3 mt-5 ">
         <AdminBar/>
       </div>
       <div className="col-9">
         <div>
           <h6 style={{textAlign:"center", marginTop:'20px'}}>Info by admin</h6>
         </div>
       </div>
     </div>
   </div>
  );
};

export default AdminProfile;
