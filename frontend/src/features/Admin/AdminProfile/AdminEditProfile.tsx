import AdminBar from "./AdminBar.tsx";
import UserFormEdition from "../../../components/Forms/UserFormEdition/UserFormEdition.tsx";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import { fetchUserById } from "../../../store/users/usersThunk.ts";

const AdminEditProfile = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id)).unwrap();
    }
  }, [dispatch, user, id]);

  return (
    <div>
      <h2 className="text-uppercase text-center mt-5">Редактирование данных</h2>
      <div className="d-flex ">
        <div className="col-3 mt-5 ">
          <AdminBar />
        </div>
        <div className="col-9">
          <UserFormEdition />
        </div>
      </div>
    </div>
  );
};

export default AdminEditProfile;
