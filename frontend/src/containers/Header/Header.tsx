import CategoryNavbar from '../../components/Navbar/CategoryNavbar.tsx';
import MainToolbar from '../../components/Toolbar/Toolbar.tsx';
import { Container } from '@mui/material';

const Header = () => {
  return (
    <div>
      <Container>
        <MainToolbar/>
      </Container>
      <CategoryNavbar/>
    </div>
  );
};

export default Header;