import React, { PropsWithChildren } from "react";
import Header from "../Header/Header.tsx";
import { Container, Box } from "@mui/material";
import Footer from "../Footer/Footer.tsx";

interface LayoutProps extends PropsWithChildren {
  beforeContainer?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, beforeContainer }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <header>
        <Header />
      </header>
      {beforeContainer}
      <main
        style={{
          flex: 1,
          marginBottom:"100px"
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </main>
      <footer>
        <Footer />
      </footer>
    </Box>
  );
};

export default Layout;
