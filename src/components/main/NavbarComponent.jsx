import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  arrow_icon,
  cart_icon,
  menu_icon,
  profile_icon,
  search_icon,
} from '../../public/assets/icons/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSettings } from '../../contexts/SettingsContext';

function NavbarComponent() {
  const admin_token = localStorage.getItem('admin_token');
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [visibleMenue, setVisibleMenue] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const [visibleSearch, setVisibleSearch] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token) setCartLength(0);
    else
      axios
        .get(`${import.meta.env.VITE_API_URL}/users/${user._id}/cart`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((r) => {
          setCartLength(r.data.body.total);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
          setCartLength(0);
        });
  });

  return (
    <>
      {admin_token ? (
        <div
          onClick={() => navigate('/dashboard')}
          className="w-full rounded-b-lg text-center flex bg-[--color-main] text-white items-center justify-center p-2 cursor-pointer space-x-2 hover:bg-black"
        >
          <span className="text-sm flex items-center justify-center text-center">داشبورد</span>
          <FontAwesomeIcon
            icon="fa-solid fa-gear"
            className="flex items-center justify-center text-center"
          />{' '}
        </div>
      ) : (
        ''
      )}

      <div className="flex justify-between items-center py-5 font-medium sm:flex-row-reverse">
        <Link to="/">
          <img src={settings?.logo} className="h-10 w-36 object-cover" />
        </Link>
        <ul className="hidden sm:flex gap-5 text-[16px] text-gray-700">
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p className="uppercase">تماس با ما</p>
            <hr className="hidden w-2/4 border-none h-[1.5px] bg-gray-700" />
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p className="uppercase">درباره ما</p>
            <hr className="hidden w-2/4 border-none h-[1.5px] bg-gray-700" />
          </NavLink>
          <NavLink to="/shop" className="flex flex-col items-center gap-1">
            <p className="uppercase">فروشگاه</p>
            <hr className="hidden w-2/4 border-none h-[1.5px] bg-gray-700" />
          </NavLink>
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p className="uppercase">خانه</p>
            <hr className="hidden w-2/4 border-none h-[1.5px] bg-gray-700" />
          </NavLink>
        </ul>

        <div className="flex items-center  gap-6">
          <img
            src={search_icon}
            alt="search"
            className="w-5 cursor-poiter"
            onClick={() => setVisibleSearch(!visibleSearch)}
          />

          <div className="group relative">
            {localStorage.getItem('token') ? (
              <>
                <Link to="/profile">
                  <img src={profile_icon} alt="profile" className="w-5 cursor-pointer" />
                </Link>
                <div className="upper group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                  <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-[--color-white] border text-[--color-gray] rounded text-end">
                    <Link to="/profile">
                      <p className="cursor-pointer hover:text-[--color-black]">حساب کاربری</p>
                    </Link>
                    <Link to="/order">
                      <p className="cursor-pointer hover:text-[--color-black]">سفارش ها</p>
                    </Link>
                    <Link to="/address">
                      <p className="cursor-pointer hover:text-[--color-black]">آدرس ها</p>
                    </Link>
                    <Link to="/">
                      <p
                        className="cursor-pointer hover:text-[var(--color-danger)]"
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('user');
                          toast.success('با موفقیت خارج شدید');
                        }}
                      >
                        خروج
                      </p>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <img
                src={profile_icon}
                alt="profile"
                className="w-5 cursor-pointer"
                onClick={() => navigate('/auth/pre')}
              />
            )}
          </div>
          <Link to="cart" className="relative">
            <img src={cart_icon} alt="cart" className="w-5 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-[var(--color-main)] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {cartLength}
            </span>
          </Link>
          <img
            onClick={() => setVisibleMenue(true)}
            src={menu_icon}
            alt="menu"
            className="w-5 cursor-pointer sm:hidden"
          />
        </div>
        {visibleSearch ? (
          <div className="fixed p-5 flex items-center justify-center w-full upper top-0 right-0 bottom-0 overflow-hidden bg-[#00000090] rounded">
            <div className="w-full  sm:w-3/4 flex items-center gap-3 mx-auto my-6 border rounded">
              <button
                onClick={() => setVisibleSearch(false)}
                className=" bg-[--color-black] text-white font-semibold text-sm px-10 py-4 hover:bg-[var(--color-danger)] rounded-l"
              >
                بستن
              </button>
              <input
                onKeyDown={(e) => {
                  e.key === 'Escape' ? setVisibleSearch(false) : null;
                  if (e.key === 'Enter') {
                    navigate(`/shop?search=${search}`);
                    setVisibleSearch(false);
                  }
                }}
                className="rounded w-full sm:flex-1 outline-none text-end font-light  text-[var(--color-white)] placeholder-[white] bg-[#00000000]"
                type="phone"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="... جستجو"
                value={search}
                required=""
              />
              <Link to={'/shop?search=' + search}>
                <button
                  onClick={() => setVisibleSearch(false)}
                  className="bg-[--color-black] text-white font-semibold text-sm px-10 py-4 hover:bg-[var(--color-main)] rounded-r"
                >
                  جستجو
                </button>
              </Link>
            </div>
          </div>
        ) : null}
        <div
          className={`fixed upper top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
            visibleMenue ? 'w-full' : 'w-0'
          }`}
        >
          <div className="flex flex-col text-gray-600 pt-3 items-end w-full">
            <div onClick={() => setVisibleMenue(false)} className="flex items-center gap-4 p-3">
              <p className="text-lg">بازگشت</p>
              <img src={arrow_icon} alt="back" className="h-4" />
            </div>
            <NavLink
              onClick={() => setVisibleMenue(false)}
              className="py-2 pr-6 border w-full text-right active:bg-[--color-black] active:text-[var(--color-white)]"
              to="/"
            >
              خانه
            </NavLink>
            <NavLink
              onClick={() => setVisibleMenue(false)}
              className="py-2 pr-6 border w-full text-right active:bg-[--color-black] active:text-[var(--color-white)]"
              to="/shop"
            >
              فروشگاه
            </NavLink>
            <NavLink
              onClick={() => setVisibleMenue(false)}
              className="py-2 pr-6 border w-full text-right active:bg-[--color-black] active:text-[var(--color-white)]"
              to="/about"
            >
              درباره ما
            </NavLink>
            <NavLink
              onClick={() => setVisibleMenue(false)}
              className="py-2 pr-6 border w-full text-right active:bg-[--color-black] active:text-[var(--color-white)]"
              to="/contact"
            >
              تماس با ما
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
export default NavbarComponent;
