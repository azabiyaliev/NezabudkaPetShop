import ClientBar from "../../../../components/Domain/Client/ClientBar.tsx";

const ClientProfile = () => {
  return (
    <div>
      <div>
        <h2 className="text-uppercase text-center mt-5">Личный кабинет</h2>
        <div className="d-flex ">
          <div className="col-3 mt-5 ">
            <ClientBar />
          </div>
          <div className="col-9">
            <div>
              <h6 style={{ textAlign: "center", marginTop: "20px" }}>
                Info by client
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
