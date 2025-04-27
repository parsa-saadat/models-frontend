import React, { useEffect, useState } from 'react';
import Title from '../../components/main/TitleComponent';
import axios from 'axios';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ProfilePage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [newFirstname, setNewFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [newLastname, setNewLastname] = useState('');
  const [address, setAddress] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState('');

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${user._id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setUsername(res.data.body.username);
        setEmail(res.data.body.email);
        setFirstname(res.data.body.firstname);
        setLastname(res.data.body.lastname);
      });
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${user._id}/address`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setAddress(res.data.body.data);
        // set default
        setDefaultAddress(res.data.body.data.find((a) => a.address.is_default)?._id);
      });
  }, []);

  async function update() {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user._id}`,
        {
          username: newUsername ? newUsername : undefined,
          email: newEmail ? newEmail : undefined,
          firstname: newFirstname ? newFirstname : undefined,
          lastname: newLastname ? newLastname : undefined,
        },
        { headers: { Authorization: token } },
      );

      if (defaultAddress) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/users/${user._id}/address/${defaultAddress}`,
          {
            address: { is_default: true },
          },
          { headers: { Authorization: token } },
        );
      }
      // set inputs to default values
      setNewUsername('');
      toast.success('بروزرسانی اطلاعات انجام شد');
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }

  return token ? (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-lg text-end">
        <div className="text-2xl mb-3 text-end my-5 pb-5 flex items-center justify-end gap-x-3">
          <Title partone="حساب" parttwo="کاربری" />
          <FontAwesomeIcon
            icon="fa-solid fa-right-from-bracket"
            className="hover:text-[--color-danger] cursor-pointer"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              toast.success('خروج با موفقیت انجام شد');
              navigate('/');
            }}
          />
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              نام خوانوادگی
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-first-name"
              type="text"
              onChange={(e) => setNewLastname(e.target.value)}
              placeholder={lastname}
            />
          </div>
          <div className="w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              نام
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              onChange={(e) => setNewFirstname(e.target.value)}
              placeholder={firstname}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-5">
          <div className="w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              ایمیل
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-city"
              type="email"
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={email ? email : 'بدون ایمیل'}
            />
          </div>
          <div className="w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              نام کاربری
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="text"
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={username}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              نشانی پیشفرض
            </label>
            <div className="relative">
              <select
                className="text-end block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
                onChange={(e) => setDefaultAddress(e.target.value)}
                defaultValue={defaultAddress}
              >
                {address.length ? (
                  address.map((item) => {
                    return (
                      <option
                        key={item._id}
                        value={item._id}
                        className="rounded"
                        selected={item._id === defaultAddress}
                      >
                        {item.address.full_address}
                      </option>
                    );
                  })
                ) : (
                  <option>بدون نشانی</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {address.length ? null : (
              <p className="text-xs text-[--color-danger] text-center mt-1">
                ابتدا به بخش نشانی بروید و یک نشانی بسازید
              </p>
            )}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                onClick={update}
                className="bg-[--color-black] text-white font-semibold text-sm px-8 py-3 transition-all hover:bg-[var(--color-main)] rounded"
              >
                به‌روزرسانی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center">
      <div className="text-2xl mb-3 text-end my-5 pb-5">
        <Title partone="پروفایل" parttwo="کاربری" />
      </div>
      <div className="text-2xl mb-3 text-end my-5 pb-5">
        <span>برای دسترسی وارد حساب کاربری خود شوید</span>
      </div>
    </div>
  );
}
export default ProfilePage;
