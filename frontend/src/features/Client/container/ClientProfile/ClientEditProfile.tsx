import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks.ts";
import { useParams } from "react-router-dom";
import { selectUser } from "../../../../store/users/usersSlice.ts";
import { fetchUserById } from "../../../../store/users/usersThunk.ts";
import UserFormEdition from "../../../../components/Forms/UserFormEdition/UserFormEdition.tsx";
import ClientBar from "../../../../components/Domain/Client/ClientBar.tsx";

const ClientEditProfile = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector(selectUser);

  useEffect(() => {
      if (id && !user) {
          dispatch(fetchUserById(id)).unwrap();
      }
  }, [dispatch, id, user]);

  return (
    <div className="d-flex ">
      <div className="col-3 mt-5 ">
        {user && user.role === "client" && <ClientBar/>}
      </div>
      <div className="col-9">
        <UserFormEdition/>
      </div>
    </div>
  );
};

export default ClientEditProfile;
