import AdminBar from "../AdminProfile/AdminBar.tsx";
import { useAppDispatch } from "../../../app/hooks.ts";
import { useEffect } from "react";
import { Box } from "@mui/material";
import AdminInfoForm from '../../../components/Forms/AdminInfoForm/AdminInfoFrom.tsx';
import { fetchAdminInfo } from '../../../store/adminInfo/adminInfoThunk.ts';

const AdminInfoPagesForm = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAdminInfo())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching site data:", error);
      });
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        "@media (max-width: 900px)": {
          flexDirection: "column",
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
      <Box
        sx={{
          margin: '0 auto',
        }}
      >
       <AdminInfoForm/>
      </Box>
    </Box>
  );
};

export default AdminInfoPagesForm;
