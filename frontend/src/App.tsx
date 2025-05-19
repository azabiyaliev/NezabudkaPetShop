import { Route, Routes, useLocation } from 'react-router-dom';
import RegisterUser from './components/Forms/UserFrom/RegisterUser.tsx';
import LoginUser from './components/Forms/UserFrom/LoginUser.tsx';
import AdminProfile from './features/Admin/AdminProfile/AdminProfile.tsx';
import NewBrandPage from './features/Admin/Brand/NewBrandPage.tsx';
import HomePage from './features/Home/HomePage.tsx';
import ProtectedRoute from './components/UI/ProtectedRoute/ProtectedRoute.tsx';
import { useAppDispatch, useAppSelector, usePermission } from './app/hooks.ts';
import { meCheck, selectUser, setMeChecked } from './store/users/usersSlice.ts';
import Layout from './components/Layout/Layout/Layout.tsx';
import EditBrandPage from './features/Admin/Brand/EditBrandPage.tsx';
import BrandsPage from './features/Admin/Brand/BrandsPage.tsx';
import EditionSitePage from './features/Admin/EditionSite/EditionSitePage.tsx';
import NewProduct from './features/Admin/Product/containers/NewProduct.tsx';
import AdminEditProfile from './features/Admin/AdminProfile/AdminEditProfile.tsx';
import ClientProfile from './features/Client/container/ClientProfile/ClientProfile.tsx';
import ClientEditProfile from './features/Client/container/ClientProfile/ClientEditProfile.tsx';
import ProductPage from './features/Product/containers/ProductPage.tsx';
import ProductsPage from './features/Admin/Product/containers/ProductsPage.tsx';
import EditProduct from './features/Admin/Product/containers/EditProduct.tsx';
import AllProductsCardsPage from './features/Product/containers/AllProductsCardsPage.tsx';
import CartPage from './features/Cart/CartPage.tsx';
import DragAndDropPhoto from './components/Forms/PhotoCarouselForm/DragAndDropPhoto.tsx';
import Photo from './components/Forms/PhotoCarouselForm/Photo.tsx';
import AdminForm from './components/Forms/AdminForm/AdminForm.tsx';
import AdminTable from './features/SuperAdmin/container/AdminTable.tsx';
import BrandPage from './features/Brand/BrandPage.tsx';
import RestorationPasswordFrom from './components/Forms/UserFrom/RestorationPasswordFrom.tsx';
import ClientTable from './features/SuperAdmin/container/ClientTable/ClientTable.tsx';
import OrderStats from './features/Admin/AdminOrderPage/OrderStats.tsx';
import FavoriteProduct from './features/FavoriteProduct/containers/FavoriteProduct.tsx';
import CompanyPage from './features/CompanyPage/CompanyPage.tsx';
import BonusProgramPage from './features/BonusProgramPage/BonusProgramPage.tsx';
import { userRoleAdmin, userRoleClient, userRoleSuperAdmin } from "./globalConstants.ts";
import DeliveryPage from './features/DeliveryPage/DeliveryPage.tsx';
import CategoryPage from './features/Category/CategoryPage/CategoryPage.tsx';
import  { useEffect } from 'react';
import { fetchMe } from './store/users/usersThunk.ts';
import ContactPage from './features/ContactPage/ContactPage.tsx';
import AllOrders from './features/Admin/AdminOrderPage/AllOrders.tsx';
import MyOrders from './features/Order/MyOrders.tsx';
import AddAdmin from './features/Admin/AddAdmin/AddAdmin.tsx';
import ErrorPage from './components/ErrorPage/ErrorPage.tsx';
import SwiperCarousel from './components/UI/Carousel/SwiperCarousel.tsx';
import AdminInfoPagesForm from './features/Admin/AdminInfoPagesForm/AdminInfoPagesForm.tsx';
import ClientInfoPagesForm from './features/Admin/ClientInfoPagesForm/ClientInfoPagesForm.tsx';
import BonusProgramFormAdminPage from './features/Admin/BonusProgramFormAdminPage/BonusProgramFormAdminPage.tsx';
import CompanyPageFormAdmin from './features/Admin/CompanyPageFormAdmin/CompanyPageFormAdmin.tsx';
import DeliveryPageFormAdmin from './features/Admin/DeliveryPageFormAdmin/DeliveryPageFormAdmin.tsx';

const App = () => {
  const user = useAppSelector(selectUser);
  const can = usePermission(user);
  const dispatch = useAppDispatch();
  const meChecked = useAppSelector(meCheck);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      document.title = "Незабудка";
    }
  }, [location]);

  useEffect(() => {
    const tokenExists = document.cookie.includes('tokenPresent=true');
    if (tokenExists) {
      dispatch(fetchMe());
    } else {
      dispatch(setMeChecked());
    }
  }, [dispatch]);

  if (!meChecked) return null;

  const isWide = can([userRoleAdmin, userRoleSuperAdmin]) && location.pathname.startsWith("/private");

  return (
    <div>
      <Layout beforeContainer={location.pathname === "/" ? <SwiperCarousel /> : null} isWide={isWide}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginUser />} />
          <Route
            path="/my_cart"
            element={
              <ProtectedRoute isAllowed={!(user && can([userRoleAdmin, userRoleSuperAdmin]))} redirectTo="/">
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path ="/my_orders" element={<MyOrders /> } />
          <Route path="/private/edit-carousel" element={<DragAndDropPhoto />} />
          <Route path="/photos/:id" element={<Photo/>}/>
          <Route path="/change-password" element={<RestorationPasswordFrom/>}/>
          <Route
            path="/private_account"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my_account/users/account/:id"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleClient])}>
                <ClientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/users/:id"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
                <AdminEditProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/client/users/:id" element={<ClientEditProfile />} />
          <Route
            path="/private/brands"
            element={
              <ProtectedRoute isAllowed={user !== null && can([userRoleAdmin, userRoleSuperAdmin])} redirectTo={"/"}>
                <BrandsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/client_orders"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
                <AllOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/private/order_stats"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleSuperAdmin])}>
                <OrderStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/add_brand"
            element={
              <ProtectedRoute isAllowed={user !== null && can([userRoleAdmin, userRoleSuperAdmin])} redirectTo={"/"}>
                <NewBrandPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/edit_brand/:id"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
                <EditBrandPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/edition_site"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
                <EditionSitePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/add_product"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
                <NewProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/products"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/edit_product/:id"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/manage_categories"
            element={
              <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage/>}/>
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/brand/:id" element={<BrandPage />} />
          <Route path="/all-products" element={<AllProductsCardsPage />} />
          <Route path="/all-products/:id" element={<AllProductsCardsPage />} />
          <Route path="/private/admin-create" element={
            <ProtectedRoute isAllowed={user && can([userRoleSuperAdmin])}>
              <AddAdmin/>
            </ProtectedRoute>
          }/>
          <Route path="/private/admin-edit/:id" element={
            <ProtectedRoute isAllowed={user && can([userRoleSuperAdmin])}>
              <AdminForm/>
            </ProtectedRoute>
          } />
          <Route path="/private/admin/statistic" element={
            <ProtectedRoute isAllowed={user && can([userRoleSuperAdmin])}>
              <OrderStats />
            </ProtectedRoute>
          }/>
          <Route path='/private/admin-table' element={
            <ProtectedRoute isAllowed={user && can([userRoleSuperAdmin])}>
              <AdminTable/>
            </ProtectedRoute>
          }/>
          <Route path='/private/clients' element={
            <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
              <ClientTable/>
            </ProtectedRoute>
          }/>
          <Route path='/favorite-products' element={<FavoriteProduct/>}/>
          <Route path='/my_company' element={<CompanyPage/>}/>
          <Route path='/private/my_company' element={
            <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
            <CompanyPageFormAdmin/>
            </ProtectedRoute>
          }/>
          <Route path='/bonus_program' element={<BonusProgramPage/>}/>
          <Route path='/private/bonus_program' element={
            <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
            <BonusProgramFormAdminPage/>
            </ProtectedRoute>
          }/>
          <Route path='/delivery' element={<DeliveryPage/>}/>
          <Route path='/private/delivery' element={
            <ProtectedRoute isAllowed={user && can([userRoleAdmin, userRoleSuperAdmin])}>
              <DeliveryPageFormAdmin/>
            </ProtectedRoute>
          }/>
          <Route path='/contacts' element={<ContactPage/>}/>
          <Route path='/private/admin_info' element={
            <ProtectedRoute isAllowed={user && can([userRoleSuperAdmin])}>
              <AdminInfoPagesForm/>
            </ProtectedRoute>
          }/>
          <Route path='/private/client_info' element={
            <ProtectedRoute isAllowed={user && can([userRoleSuperAdmin])}>
              <ClientInfoPagesForm/>
            </ProtectedRoute>
          }/>
        </Routes>
      </Layout>
    </div>
  );
};

export default App;
