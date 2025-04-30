import React, { useState } from 'react';
import { menu_icon } from '../../public/assets/icons/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

function DashboardNavbarComponent() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <>
      <div className="sm:hidden p-4 bg-white border-b flex justify-between items-center">
        <span className=" font-bold text-gray-800 text-sm">داشبورد</span>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-[--color-gray] p-2 rounded transition"
        >
          <img src={menu_icon} className="rotate-180 w-5" />
        </button>
      </div>

      <div
        className={`bg-white sm:w-64 w-full sm:min-h-screen p-4 space-y-4 border-e transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'block' : 'hidden'
        } sm:block`}
      >
        <img src={settings?.logo} onClick={() => navigate('/')} className='hidden sm:block h-10 w-2/3 object-cover cursor-pointer' alt="" />
        <ul className="flex flex-col space-y-2 text-sm font-medium text-gray-600">
          {[
            { path: '/', label: 'خانه', end: true },
            { path: '/dashboard', label: 'پیشخوان', end: true },
            { path: '/dashboard/setting', label: 'تنطیمات' },
            { path: '/dashboard/orders', label: 'سفارشات' },
            { path: '/dashboard/products', label: 'محصولات' },
            { path: '/dashboard/users', label: 'کاربران' },
            { path: '/dashboard/logs', label: 'لاگ ها' },
            { path: '/dashboard/address', label: 'نشانی ها' },
            { path: '/dashboard/medias', label: 'آرشیو رسانه' },
          ].map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `block w-full text-right px-4 py-2 rounded transition ${
                    isActive ? 'bg-[--color-main] text-white ' : 'hover:bg-[--color-light-gray]'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block w-full text-right px-4 py-2 rounded transition text-[--color-danger] hover:bg-[--color-light-gray]`
              }
              onClick={() => {
                localStorage.removeItem('admin_token');
                setIsMenuOpen(false);
              }}
            >
              خروج از حساب
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default DashboardNavbarComponent;
