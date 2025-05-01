import { Outlet } from 'react-router-dom';
import DashboardNavbarComponent from '../dashboard/DahboardNavbarComponent';

const DashboardLayout = () => {
  const admin_token = localStorage.getItem('admin_token');

  if (!admin_token) {
    location = '/dashboard/pre';
  }

  return (
    <div dir="rtl" className="admin-wrapper min-h-screen flex flex-col md:flex-row">
      <DashboardNavbarComponent />
      <div className="flex-1 pt-6 md:p-6 text-sm">
        <div className="bg-white rounded p-6 border">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
