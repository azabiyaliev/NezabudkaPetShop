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
import CompanyPageFrom from './components/Forms/CompanyPageFrom/CompanyPageFrom.tsx';
import BonusProgramPage from './features/BonusProgramPage/BonusProgramPage.tsx';
import BonusProgramForm from './components/Forms/BonusProgramForm/BonusProgramForm.tsx';
import { userRoleAdmin, userRoleSuperAdmin } from './globalConstants.ts';
import DeliveryPage from './features/DeliveryPage/DeliveryPage.tsx';
import DeliveryPageForm from './components/Forms/DeliveryPageFrom/DeliveryPageFrom.tsx';
import CategoryPage from './features/Category/CategoryPage/CategoryPage.tsx';
import  { useEffect } from 'react';
import { fetchMe } from './store/users/usersThunk.ts';
import ContactPage from './features/ContactPage/ContactPage.tsx';
import AllOrders from './features/Admin/AdminOrderPage/AllOrders.tsx';
import MyOrders from './features/Order/MyOrders.tsx';
import AddAdmin from './features/Admin/AddAdmin/AddAdmin.tsx';
import ErrorPage from './components/ErrorPage/ErrorPage.tsx';
import SwiperCarousel from './components/UI/Carousel/SwiperCarousel.tsx';

const App = () => {
  const user = useAppSelector(selectUser);
  const can = usePermission(user);
  const dispatch = useAppDispatch();
  const meChecked = useAppSelector(meCheck);
  const location = useLocation();

  useEffect(() => {
    const tokenExists = document.cookie.includes('tokenPresent=true');
    if (tokenExists) {
      dispatch(fetchMe());
    } else {
      dispatch(setMeChecked());
    }
  }, [dispatch]);

  if (!meChecked) return null;

  return (
    <div>
      <Layout beforeContainer={location.pathname === "/" ? <SwiperCarousel /> : null}>
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
          <Route path="/edit-carousel" element={<DragAndDropPhoto />} />
          <Route path="/photos/:id" element={<Photo/>}/>
          <Route path="/change-password" element={<RestorationPasswordFrom/>}/>
          <Route
            path="/private_account"
            element={
              <ProtectedRoute isAllowed={user && can(["admin", "superAdmin"])}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my_account/users/account/:id"
            element={
              <ProtectedRoute isAllowed={user && can(["client"])}>
                <ClientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/users/:id"
            element={
              <ProtectedRoute isAllowed={user && can(["admin", "superAdmin"])}>
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
              <ProtectedRoute isAllowed={user && can(["admin", "superAdmin"])}>
                <AllOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/private/order_stats"
            element={
              <ProtectedRoute isAllowed={user && can(["superAdmin"])}>
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
              <ProtectedRoute isAllowed={user && can(["admin", "superAdmin"])}>
                <EditBrandPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edition_site"
            element={
              <ProtectedRoute isAllowed={user && can(["admin", "superAdmin"])}>
                <EditionSitePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/add_product"
            element={
              <ProtectedRoute isAllowed={user && can(["admin", "superAdmin"])}>
                <NewProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/products"
            element={
              <ProtectedRoute isAllowed={user && can(["admin", "superAdmin"])}>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/edit_product/:id"
            element={
              <ProtectedRoute isAllowed={user && can(["admin", "superAdmin"])}>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/private/manage_categories"
            element={
              <ProtectedRoute isAllowed={user && can(["admin", "superAdmin"])}>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage/>}/>
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/brand/:id" element={<BrandPage />} />
          <Route path="/all-products" element={<AllProductsCardsPage />} />
          <Route path="/all-products/:id" element={<AllProductsCardsPage />} />
          <Route path="/admin-create" element={
            <ProtectedRoute isAllowed={user && can(["superAdmin"])}>
              <AddAdmin/>
            </ProtectedRoute>
          }/>
          <Route path="/admin-edit/:id" element={
            <ProtectedRoute isAllowed={user && can(["superAdmin"])}>
              <AdminForm/>
            </ProtectedRoute>
          } />
          <Route path="/admin/statistic" element={
            <ProtectedRoute isAllowed={user && can(['superAdmin'])}>
              <OrderStats />
            </ProtectedRoute>
          }/>
          <Route path='/admin-table' element={
            <ProtectedRoute isAllowed={user && can(["superAdmin"])}>
              <AdminTable/>
            </ProtectedRoute>
          }/>
          <Route path='/private/clients' element={
            <ProtectedRoute isAllowed={user && can(["superAdmin", "admin"])}>
              <ClientTable/>
            </ProtectedRoute>
          }/>
          <Route path='/favorite-products' element={<FavoriteProduct/>}/>
          <Route path='/my_company' element={<CompanyPage/>}/>
          <Route path='/my_company/:id' element={
            <ProtectedRoute isAllowed={user && can(["superAdmin", "admin"])}>
            <CompanyPageFrom/>
            </ProtectedRoute>
          }/>
          <Route path='/bonus_program' element={<BonusProgramPage/>}/>
          <Route path='/bonus_program/:id' element={
            <ProtectedRoute isAllowed={user && can(["superAdmin", "admin"])}>
            <BonusProgramForm/>
            </ProtectedRoute>
          }/>
          <Route path='/delivery' element={<DeliveryPage/>}/>
          <Route path='/delivery/:id' element={
            <ProtectedRoute isAllowed={user && can(["superAdmin", "admin"])}>
              <DeliveryPageForm/>
            </ProtectedRoute>
          }/>
          <Route path='/contacts' element={<ContactPage/>}/>
        </Routes>
      </Layout>
    </div>
  );
};

export default App;
