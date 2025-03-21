import React, { PropsWithChildren } from 'react';
import Header from '../Header/Header.tsx';
import { Container } from '@mui/material';
import Footer from '../footer/footer.tsx';

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
      <footer>
        <Footer/>
      </footer>
    </>
  );
};

export default Layout;
