import { Route, Routes } from "react-router-dom";
import RegisterUser from "./containers/UserFrom/RegisterUser.tsx";
import LoginUser from "./containers/UserFrom/LoginUser.tsx";
import { Container, CssBaseline } from "@mui/material";
import Header from './containers/Header/Header.tsx';
import AdminProfile from './containers/Admin/AdminProfile/AdminProfile.tsx';
import AdminForm from './containers/Admin/AdminProfile/AdminForm.tsx';

const App = () => {
  return (
    <>
      <CssBaseline />

      <header>
        <Header/>
      </header>

      <main>
        <Container maxWidth="lg">
          <Routes>
            <Route path="*" element={<h1>Not found</h1>} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/login" element={<LoginUser />} />
            <Route path="/private" element={<AdminProfile />} />
            <Route path="/users/:id" element={<AdminForm />} />
          </Routes>
        </Container>
      </main>
    </>
  );
};
// 3:22 1:19 3:05
export default App;
