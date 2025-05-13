import React, { PropsWithChildren } from 'react';
import Header from '../Header/Header.tsx';
import { Box } from '@mui/material';
import Footer from '../Footer/Footer.tsx';

interface LayoutProps extends PropsWithChildren {
  beforeContainer?: React.ReactNode;
  isWide?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, beforeContainer, isWide }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "white",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Header/>
      </header>
      {beforeContainer}
      <main
        style={{
          flex: 1,
          marginBottom: "100px"
        }}
      >
        {isWide ? (
          <Box
            sx={{
              maxWidth: "100%",
              padding: "0 20px",
              boxSizing: "border-box",
            }}
          >
            {children}
          </Box>
        ) : (
          <Box>{children}</Box>
        )}
      </main>
      <footer>
        <Footer/>
      </footer>
    </Box>
  );
};

export default Layout;
