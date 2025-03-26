import { Route, Routes } from 'react-router-dom';
import RegisterUser from './components/Forms/UserFrom/RegisterUser.tsx';
import LoginUser from './components/Forms/UserFrom/LoginUser.tsx';
import AdminProfile from './features/Admin/AdminProfile/AdminProfile.tsx';
import NewBrandPage from './features/Admin/Brand/NewBrandPage.tsx';
import HomePage from './features/Home/HomePage.tsx';
import ProtectedRoute from './components/UI/ProtectedRoute/ProtectedRoute.tsx';
import { useAppSelector } from './app/hooks.ts';
import { selectUser } from './store/users/usersSlice.ts';
import Layout from './components/Layout/Layout/Layout.tsx';
import EditBrandPage from './features/Admin/Brand/EditBrandPage.tsx';
import BrandsPage from './features/Admin/Brand/BrandsPage.tsx';
import NewCategory from './features/Category/NewCategory/NewCategory.tsx';
import AllCategoriesPage from './features/Category/AllCategoriesPage/AllCategoriesPage.tsx';
import OneCategory from './features/Category/OneCategory/OneCategory.tsx';
import EditionSitePage from './features/Admin/EditionSite/EditionSitePage.tsx';
import NewProduct from './features/Admin/Product/containers/NewProduct.tsx';
import AdminEditProfile from './features/Admin/AdminProfile/AdminEditProfile.tsx';
import ClientProfile from './features/Client/ClientProfile/ClientProfile.tsx';
import ClientEditProfile from './features/Client/ClientProfile/ClientEditProfile.tsx';
import OrderPage from './features/Order/OrderPage.tsx';
import ProductPage from './features/Product/containers/ProductPage.tsx';
import ProductsPage from './features/Admin/Product/containers/ProductsPage.tsx';
import EditProduct from './features/Admin/Product/containers/EditProduct.tsx';
import AllProductsCardsPage from './features/Product/containers/AllProductsCardsPage.tsx';
import CartPage from './features/Cart/CartPage.tsx';
import NewSubcategory from './features/Category/NewSubcategory/NewSubcategory.tsx';

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
          <Route path="/my_order" element={<OrderPage />} />
          <Route path="/private_account" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <AdminProfile />
            </ProtectedRoute>
          } />
          <Route path="/my_account" element={
            <ProtectedRoute isAllowed={user && user.role === 'client'}>
              <ClientProfile />
            </ProtectedRoute>
          } />
          <Route path="/private/users/:id" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <AdminEditProfile />
            </ProtectedRoute>
          } />
          <Route path="/client/users/:id" element={<ClientEditProfile/>}/>
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
          <Route path="/edition_site" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <EditionSitePage />
            </ProtectedRoute>
          } />
          <Route path="/private/add_product" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <NewProduct />
            </ProtectedRoute>
          }/>
          <Route path="/private/products" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <ProductsPage />
            </ProtectedRoute>
          }/>
          <Route path="/private/edit_product/:id" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <EditProduct />
            </ProtectedRoute>
          }/>
          <Route path="/private/all_categories" element={<AllCategoriesPage/>}/>
          <Route path="/category/:id" element={<OneCategory/>}/>
          <Route path="*" element={<h1>Not found</h1>} />
          <Route path="/private/add_category" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <NewCategory/>
            </ProtectedRoute>
          } />
          <Route path="/private/add_subcategory" element={
            <ProtectedRoute isAllowed={user && user.role === 'admin'}>
              <NewSubcategory/>
            </ProtectedRoute>
          } />
          <Route path="/product/:id" element={<ProductPage/>}/>
          <Route path="/all-products" element={<AllProductsCardsPage/>}/>
        </Routes>
      </Layout>
    </div>
  );
};

export default App;
