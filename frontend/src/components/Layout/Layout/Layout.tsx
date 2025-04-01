import React, { PropsWithChildren } from "react";
import Header from "../Header/Header.tsx";
import { Container } from "@mui/material";
import Footer from "../Footer/Footer.tsx";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
          {children}
        </Container>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Layout;
