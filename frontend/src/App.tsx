import { Route, Routes } from 'react-router-dom';
import RegisterUser from './containers/UserFrom/RegisterUser.tsx';
import LoginUser from './containers/UserFrom/LoginUser.tsx';
import AdminProfile from './containers/Admin/AdminProfile/AdminProfile.tsx';
import AdminForm from './containers/Admin/AdminProfile/AdminForm.tsx';
import NewBrand from './containers/Admin/Brand/NewBrand.tsx';
import HomePage from './containers/Home/HomePage.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import { useAppSelector } from './app/hooks.ts';
import { selectUser } from './features/users/usersSlice.ts';
import Layout from './components/Layout/Layout.tsx';
import EditBrand from './containers/Admin/Brand/EditBrand.tsx';

const App = () => {
  const user = useAppSelector(selectUser);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/private_account" element={<AdminProfile />} />
        <Route path="/private/add_brand" element={
          <ProtectedRoute isAllowed={user && user.role === 'admin'}>
            <NewBrand />
          </ProtectedRoute>
        } />
        <Route path="/private/edit_brand/:id" element={
          <ProtectedRoute isAllowed={user && user.role === 'admin'}>
            <EditBrand />
          </ProtectedRoute>
        } />
        <Route path="/users/:id" element={<AdminForm />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </Layout>
  );
};

export default App;
