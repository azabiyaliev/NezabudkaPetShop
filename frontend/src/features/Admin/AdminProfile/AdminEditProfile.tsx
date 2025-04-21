import AdminBar from "./AdminBar.tsx";
import UserFormEdition from "../../../components/Forms/UserFormEdition/UserFormEdition.tsx";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import { fetchUserById } from "../../../store/users/usersThunk.ts";
import Typography from '@mui/joy/Typography';

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
    <div className="d-flex ">
      <div className="col-3 ">
        <AdminBar/>
      </div>
      <div className="col-9">
        <Typography
          level="h2"
          component="h1"
          sx={{textAlign: "center", margin: "30px 0"}}
        >
          Редактирование личного кабинета
        </Typography>
        <UserFormEdition/>
      </div>
    </div>
  );
};

export default AdminEditProfile;
