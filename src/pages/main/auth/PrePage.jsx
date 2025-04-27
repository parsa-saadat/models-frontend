import React, { useState } from 'react';

import { validateIRPhoneSyntax } from '../../../utils/validators/phone.validator';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSettings } from '../../../contexts/SettingsContext';

function PrePage() {
  const navigate = useNavigate();

  const { settings } = useSettings();

  const [phone, setPhone] = useState('');
  const [acceptRule, setAcceptRule] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (acceptRule) {
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
              navigate(`/auth/verify?phone=${phone}`);
            } else {
              toast.error('مشکلی رخ داده');
            }
          });
      } else {
        toast.error('شماره تلفن وارد شده نادرست است');
      }
    } else {
      toast.error('لطفا قوانین را بخوانید و تایید کنید');
    }
  };

  return (
    <div className=" w-full max-w-sm mx-auto overflow-hidden bg-white rounded border mt-[75px]">
      <div className="px-6 pb-4">
        <div className="flex justify-center mx-auto">
          <img className="w-32 h-24 object-cover" src={settings?.logo} alt="" />
        </div>

        <h3 className="mt-1 text-xl font-medium text-center text-gray-600 ">خوش اومدی</h3>

        <p className="mt-1 text-center text-gray-500 ">ورود یا ثبت نام</p>

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

        <div className="flex gap-x-2 mb-6 mt-6 flex-row-reverse text-end">
          <input
            value={acceptRule}
            onClick={() => setAcceptRule(!acceptRule)}
            type="checkbox"
            id="terms1"
            required
          />
          <div className="flex flex-col">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              پزیرش
              <a href="/rules"> قوانین ما</a>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrePage;
