import { Route, Routes } from "react-router-dom";
import RegisterUser from "./containers/UserFrom/RegisterUser.tsx";
import LoginUser from "./containers/UserFrom/LoginUser.tsx";
import { CssBaseline } from "@mui/material";
import Header from './containers/Header/Header.tsx';
import AdminProfile from './containers/Admin/AdminProfile/AdminProfile.tsx';
import AdminForm from './containers/Admin/AdminProfile/AdminForm.tsx';
import EditSiteFrom from './containers/Admin/AdminProfile/EditSiteFrom.tsx';
import NewCategory from './containers/Category/NewCategory/NewCategory.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import { useAppSelector } from './app/hooks.ts';
import { selectUser } from './features/users/usersSlice.ts';
import AllCategoriesPage from './containers/Category/AllCategoriesPage/AllCategoriesPage.tsx';

const App = () => {
  const user = useAppSelector(selectUser);

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
            <Route path="/edition_site" element={<EditSiteFrom />} />
            <Route path="/private/all_categories" element={<AllCategoriesPage/>}/>
            <Route path="/private/add_category" element={
              <ProtectedRoute isaAllowed={user && user.role == 'admin'}>
                <NewCategory/>
              </ProtectedRoute>
            } />
          </Routes>
      </main>
    </>
  );
};
// 3:22 1:19 3:05
export default App;
