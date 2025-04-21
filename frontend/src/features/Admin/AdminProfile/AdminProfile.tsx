import AdminBar from "./AdminBar.tsx";

const AdminProfile = () => {
  return (
    <div>
      <div className="d-flex ">
        <div className="col-3 ">
          <AdminBar />
        </div>
        <div className="col-9">
          <h2 className="text-uppercase text-center mt-4">Личный кабинет</h2>
          <div>
            <h6 style={{textAlign: "center", marginTop: "20px"}}>
              Info by admin
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
