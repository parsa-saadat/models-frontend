import { Outlet } from 'react-router-dom';
import NavbarComponent from '../main/NavbarComponent.jsx';
import FooterComponent from '../main/FooterComponent.jsx';

const MainLayout = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px[9vw]">
      <NavbarComponent />
      <Outlet />
      <FooterComponent />
    </div>
  );
};

export default MainLayout;
