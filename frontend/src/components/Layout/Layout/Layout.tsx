import React, { PropsWithChildren } from "react";
import Header from "../Header/Header.tsx";
import { Container, Box } from "@mui/material";
import Footer from "../Footer/Footer.tsx";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
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
      <main
        style={{
          flex: 1,
          marginBottom:"100px"
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
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
