import CategoryNavbar from '../../components/Navbar/CategoryNavbar.tsx';
import MainToolbar from '../../components/Toolbar/Toolbar.tsx';
import { Container } from '@mui/material';

const Header = () => {
  return (
    <>
      <Container>
        <MainToolbar/>
      </Container>
      <CategoryNavbar/>
    </>
  );
};

export default Header;