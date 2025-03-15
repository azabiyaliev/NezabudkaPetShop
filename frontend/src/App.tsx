import { Route, Routes } from "react-router-dom";
import RegisterUser from "./containers/UserFrom/RegisterUser.tsx";
import LoginUser from "./containers/UserFrom/LoginUser.tsx";
import { CssBaseline } from "@mui/material";
import Header from './containers/Header/Header.tsx';
import AdminProfile from './containers/Admin/AdminProfile/AdminProfile.tsx';
import AdminForm from './containers/Admin/AdminProfile/AdminForm.tsx';
import EditSiteForm from './containers/Admin/AdminProfile/EditSiteForm.tsx';

const App = () => {
  return (
    <>
      <CssBaseline />
      <header>
        <Header/>
      </header>
      <main>
          <Routes>
            <Route path="*" element={<h1>Not found</h1>} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/login" element={<LoginUser />} />
            <Route path="/private" element={<AdminProfile />} />
            <Route path="/users/:id" element={<AdminForm />} />
            <Route path="/edition_site" element={<EditSiteForm />} />
          </Routes>
      </main>
    </>
  );
};
export default App;
