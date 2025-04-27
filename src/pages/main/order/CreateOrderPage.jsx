import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Title from '../../../components/main/TitleComponent';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CreateOrderPage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isExpress, setIsExpress] = useState(false);
  const [note, setNote] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${user._id}/address`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setAddress(res.data.body.data);
        setSelectedAddress(res.data.body.data.find((a) => a.address.is_default)?._id);
      });
  }, []);

  const createOrder = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          address_id: selectedAddress,
          express: isExpress,
          note: note,
          code: code,
        },
        { headers: { Authorization: token } },
      )
      .then((r) => {
        toast.success('سفارش شما با موفقیت ثبت شد');
        navigate('/order');
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || 'خطا در ثبت سفارش');
      });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-lg text-end">
        <div className="text-2xl mb-3 text-end my-5 pb-5 flex items-center justify-end gap-x-3">
          <Title partone="ثبت" parttwo="سفارش" />
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              کد ارسال شده به شماره همراه
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-first-name"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              توضیحات ( اختیاری )
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight h-32 focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-first-name"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-2/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              نشانی تحویل
            </label>
            <div className="relative">
              <select
                className="text-end block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
                onChange={(e) => setSelectedAddress(e.target.value)}
                defaultValue={selectedAddress}
              >
                {address.length ? (
                  address.map((item) => {
                    return (
                      <option
                        key={item._id}
                        value={item._id}
                        className="rounded"
                        selected={item._id === selectedAddress}
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
            <div className="flex justify-end mt-6 items-center gap-x-2">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold ">
                ارسال سریع ( افزایش قیمت )
              </label>
              <input
                type="checkbox"
                value={isExpress}
                onChange={(e) => setIsExpress(!isExpress)}
                className="bg-[--color-black] text-white font-semibold text-sm px-8 transition-all hover:bg-[var(--color-main)] rounded"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-[--color-black] text-white font-semibold text-sm px-8 py-3 transition-all hover:bg-[var(--color-main)] rounded"
                onClick={createOrder}
              >
                ثبت سفارش
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreateOrderPage;
