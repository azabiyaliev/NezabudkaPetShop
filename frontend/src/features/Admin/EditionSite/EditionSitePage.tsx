import AdminBar from "../AdminProfile/AdminBar.tsx";
import { useAppDispatch } from "../../../app/hooks.ts";
import { useEffect } from "react";
import { fetchSite } from "../../../store/editionSite/editionSiteThunk.ts";
import EditSiteForm from "../../../components/Forms/EditSiteForm/EditSiteForm.tsx";
import { Box } from '@mui/material';

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
    <Box sx={{ display: "flex", margin: "30px 0" }}>
      <Box>
        <AdminBar />
      </Box>
      <Box sx={{ flexGrow: 1, pl: 3, pr: 3 }}>
        <EditSiteForm />
      </Box>
    </Box>
  );
};

export default EditionSitePage;
