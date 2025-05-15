import AdminBar from "./AdminBar.tsx";
import {
  useAppDispatch,
  useAppSelector,
  usePermission,
} from "../../../app/hooks.ts";
import { selectUser } from "../../../store/users/usersSlice.ts";
import { userRoleAdmin } from "../../../globalConstants.ts";
import { selectAdminInfo } from "../../../store/adminInfo/adminInfoSlice.ts";
import { useEffect } from "react";
import { fetchAdminInfo } from "../../../store/adminInfo/adminInfoThunk.ts";
import { Paper, Typography, Box } from "@mui/material";

const AdminProfile = () => {
  const user = useAppSelector(selectUser);
  const adminInfo = useAppSelector(selectAdminInfo);
  const dispatch = useAppDispatch();
  const can = usePermission(user);

  useEffect(() => {
    dispatch(fetchAdminInfo());
  }, [dispatch]);

  return (
    <>
      {user && can([userRoleAdmin]) && (
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
              flexShrink: 0,
              height: "100%",
              marginRight: 2,
              "@media (max-width: 900px)": {
                display: "none",
              },
            }}
          >
            <AdminBar />
          </Box>
          <Box sx={{margin: '0 auto'}}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", fontWeight: 600 }}
            >
              Личный кабинет
            </Typography>
            <Paper
              sx={{
                p: 3,
                mt: 2,
                mx: "auto",
                width: "100%",
                maxWidth: "800px",
                display: "flex",
                justifyContent: "center",
              }}
              elevation={2}
            >
              <Box
                sx={{ textAlign: "center" }}
                dangerouslySetInnerHTML={{
                  __html: adminInfo?.information || "",
                }}
              />
            </Paper>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AdminProfile;
