import AdminBar from "../AdminProfile/AdminBar.tsx";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { useEffect } from "react";
import { fetchSite } from "../../../store/editionSite/editionSiteThunk.ts";
import EditSiteForm from "../../../components/Forms/EditSiteForm/EditSiteForm.tsx";
import { selectEditSite } from "../../../store/editionSite/editionSiteSlice.ts";

const EditionSitePage = () => {
  const dispatch = useAppDispatch();
  const site = useAppSelector(selectEditSite);
  console.log("Site from Redux:", site);

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
    <div className="d-flex ">
      <div className="col-3 mt-5 ">
        <AdminBar />
      </div>
      <div className="col-9">
        <EditSiteForm />
      </div>
    </div>
  );
};

export default EditionSitePage;
