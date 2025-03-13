import CategoryNavbar from '../../components/Navbar/CategoryNavbar.tsx';
import MainToolbar from '../../components/Toolbar/Toolbar.tsx';

const Header = () => {
  return (
    <div>
      <MainToolbar/>
      <CategoryNavbar/>
    </div>
  );
};

export default Header;