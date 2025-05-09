import React, { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

function VerifyAdminPage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [code, setCode] = useState('');

  // get phone with querys
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const phone = urlParams.get('phone');

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        phone: phone,
        code,
      })
      .then((res) => {
        const { token, username, _id, phone, role } = res.data.body;
        if (role == 'admin') {
          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin', JSON.stringify({ username, _id, phone, role }));
          toast.success('ورود با موفقیت انجام شد');
          navigate('/dashboard');
        } else {
          toast.error('شما ادمین نیستید');
          navigate('/');
        }
      })
      .catch((err) => {
        toast.error('کد وارد شده نادرست است');
      });
  }

  return (
    <div className=" w-full max-w-sm mx-auto overflow-hidden bg-white rounded border mt-[75px]">
      <div className="px-6 pb-4">
        <div className="flex justify-center mx-auto mt-5 mb-2">
          <img className="w-40 h-20 object-cover" src={settings?.logo} alt="" />
        </div>

        <h3 className="my-1 text-xl font-medium text-center text-gray-600 ">
          کد برای شماره شما ارسال شد
        </h3>

        <p className="mt-1 text-center text-gray-500 ">کد ارسال شده رو وارد کنید</p>

        <div className="w-full mt-4">
          <input
            onChange={(e) => {
              setCode(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
            value={code}
            required
            className="text-center w-full sm:flex-1 outline-none block px-4 py-2 mt-2 text-gray-700 placeholder-[--color-gray] bg-white border rounded"
            type="text"
            placeholder="code"
            aria-label="PhoneNumber"
          />
        </div>

        <div className="flex items-center justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[--color-black] rounded hover:bg-[--color-main"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyAdminPage;
