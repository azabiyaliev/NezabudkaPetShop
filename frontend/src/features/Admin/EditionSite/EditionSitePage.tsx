import AdminBar from "../AdminProfile/AdminBar.tsx";
import { useAppDispatch } from "../../../app/hooks.ts";
import { useEffect } from "react";
import { fetchSite } from "../../../store/editionSite/editionSiteThunk.ts";
import EditSiteForm from "../../../components/Forms/EditSiteForm/EditSiteForm.tsx";
import { Box } from "@mui/material";

const EditionSitePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSite())
      .unwrap()
      .then((data) => {
        console.log("Data fetched:", data);
      })
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
      <Box sx={{ minWidth: 240 }}>
        <AdminBar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
        }}
      >
        <EditSiteForm />
      </Box>
    </Box>
  );
};

export default EditionSitePage;
