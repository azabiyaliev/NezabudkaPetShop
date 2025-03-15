import React, { PropsWithChildren } from 'react';
import Header from '../Header/Header.tsx';
import { Container } from '@mui/material';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header>
       <Header/>
      </header>
      <main>
        <Container maxWidth="lg">
          {children}
        </Container>
      </main>
    </>
  );
};

export default Layout;
