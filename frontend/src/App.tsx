import { Route, Routes } from "react-router-dom";
import RegisterUser from "./containers/UserFrom/RegisterUser.tsx";
import LoginUser from "./containers/UserFrom/LoginUser.tsx";
import { Container, CssBaseline } from "@mui/material";
import Header from './containers/Header/Header.tsx';

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
          </Routes>
        </Container>
      </main>
    </>
  );
};

export default App;
