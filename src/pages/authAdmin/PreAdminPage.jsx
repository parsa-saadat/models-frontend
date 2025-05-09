import React, { useState } from 'react';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateIRPhoneSyntax } from '../../utils/validators/phone.validator';
import { useSettings } from '../../contexts/SettingsContext';

function PreAdminPage() {
  const navigate = useNavigate();

  const { settings } = useSettings();

  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone && validateIRPhoneSyntax(phone)) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/auth/pre`, {
          phone: phone,
          accept_rules: true,
        })
        .then((res) => {
          if (res.data.success) {
            setPhone(phone);
            toast.success('کد برای شماره شما ارسال شد');
            navigate(`/dashboard/verify?phone=${phone}`);
          } else {
            toast.error('مشکلی رخ داده');
          }
        });
    } else {
      toast.error('شماره تلفن وارد شده نادرست است');
    }
  };

  return (
    <div className=" w-full max-w-sm mx-auto overflow-hidden bg-white rounded border mt-[75px]">
      <div className="px-6 pb-4">
        <div className="flex justify-center mx-auto mt-5 mb-2">
          <img className="w-40 h-20 object-cover" src={settings?.logo} alt="" />
        </div>
        <h3 className="mt-1 text-xl font-medium text-center text-gray-600 ">خوش اومدی</h3>

        <p className="mt-1 text-center text-gray-500 ">ورود به پنل ادمین</p>

        <div className="w-full mt-4">
          <input
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            value={phone}
            required
            className="w-full sm:flex-1 outline-none text-end block px-4 py-2 mt-2 text-gray-700 placeholder-[--color-gray] bg-white border rounded"
            type="tel"
            placeholder="شماره همراه"
            aria-label="PhoneNumber"
          />
        </div>

        <div className="flex items-center justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[--color-black] rounded hover:bg-[--color-main]"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreAdminPage;
