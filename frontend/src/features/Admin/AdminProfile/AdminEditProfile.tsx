import AdminBar from "./AdminBar.tsx";
import UserFormEdition from "../../../components/Forms/UserFormEdition/UserFormEdition.tsx";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import { fetchUserById } from "../../../store/users/usersThunk.ts";
import { Box } from "@mui/material";

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
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        "@media (max-width: 900px)": {
          flexWrap: "wrap",
        },
      }}
    >
      <Box
        sx={{
          "@media (max-width: 900px)": {
            display: "none",
          },
        }}>
        <AdminBar />
      </Box>
      <Box sx={{ flexGrow: 1, pl: 3, pr: 3, maxWidth: 1200,   mx: "auto", }}>
        <UserFormEdition />
      </Box>
    </Box>
  );
};

export default AdminEditProfile;
