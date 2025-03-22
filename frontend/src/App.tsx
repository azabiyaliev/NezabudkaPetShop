import { Route, Routes } from 'react-router-dom';
import RegisterUser from './containers/UserFrom/RegisterUser.tsx';
import LoginUser from './containers/UserFrom/LoginUser.tsx';
import AdminProfile from './containers/Admin/AdminProfile/AdminProfile.tsx';
import AdminForm from './containers/Admin/AdminProfile/AdminForm.tsx';
import NewBrandPage from './containers/Admin/Brand/NewBrandPage.tsx';
import HomePage from './containers/Home/HomePage.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import { useAppSelector } from './app/hooks.ts';
import { selectUser } from './features/users/usersSlice.ts';
import Layout from './components/Layout/Layout.tsx';
import EditBrandPage from './containers/Admin/Brand/EditBrandPage.tsx';
import BrandsPage from './containers/Admin/Brand/BrandsPage.tsx';
import NewCategory from './containers/Category/NewCategory/NewCategory.tsx';
import AllCategoriesPage from './containers/Category/AllCategoriesPage/AllCategoriesPage.tsx';
import OneCategory from './containers/Category/OneCategory/OneCategory.tsx';
import EditionSitePage from './containers/Admin/EditionSite/EditionSitePage.tsx';
import NewProduct from './containers/Admin/Product/containers/NewProduct.tsx';import CartPage from './containers/Cart/CartPage.tsx';

const App = () => {
  const user = useAppSelector(selectUser);
  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/my_cart" element={<CartPage />} />
          <Route path="/private_account" element={<AdminProfile />} />
          <Route path="/private/brands" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <BrandsPage />
            </ProtectedRoute>
          } />
          <Route path="/private/add_brand" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <NewBrandPage />
            </ProtectedRoute>
          } />
          <Route path="/private/edit_brand/:id" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <EditBrandPage />
            </ProtectedRoute>
          } />
          <Route path="/users/:id" element={<AdminForm />} />
          <Route path="/edition_site" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <EditionSitePage />
            </ProtectedRoute>
          } />
          <Route path="private/add_product" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <NewProduct />
            </ProtectedRoute>
          }/>
          <Route path="/private/all_categories" element={<AllCategoriesPage/>}/>
          <Route path="/category/:id" element={<OneCategory/>}/>
          <Route path="*" element={<h1>Not found</h1>} />
          <Route path="/private/add_category" element={
            <ProtectedRoute isAllowed={user && user.role == 'admin'}>
              <NewCategory/>
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </div>

  );
};

export default App;
