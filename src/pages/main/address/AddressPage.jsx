import React, { useEffect, useState } from 'react';
import Title from '../../../components/main/TitleComponent';
import axios from 'axios';

import { arrow_icon, bin_icon } from '../../../public/assets/icons/icons';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function AddressPage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  const [address, setAddress] = useState([]);
  const [fullAddress, setFullAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [province, setProvince] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [is_default, setIsDefault] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${user._id}/address`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setAddress(res.data.body.data);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, []);

  const removeAddress = (addressId) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/users/${user._id}/address/${addressId}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        setAddress(address.filter((a) => a._id !== addressId));
        toast.success('آدرس با موفقیت حذف شد');
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  const createAddress = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/address`,
        {
          address: {
            full_name: fullName,
            full_address: fullAddress,
            building_number: buildingNumber,
            city: city,
            province: province,
            neighborhood: neighborhood,
            unit: unit,
            postal_code: postalCode,
            is_default: is_default,
          },
        },
        {
          headers: { Authorization: token },
        },
      )
      .then((res) => {
        setAddress([...address, res.data.body]);
        toast.success('آدرس با موفقیت ایجاد شد');
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  return (
    <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start xl:mt-48 h-screen xl:h-full">
      <div className="w-full xl:w-3/5 xl:pt-9">
        <div className="relative overflow-x-auto">
          <table className="xl:w-full text-sm text-right text-gray-500 overflow-x-scroll w-[900px]">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 rounded">
                  عمل
                </th>
                <th scope="col" className="px-4 py-3">
                  واحد
                </th>
                <th scope="col" className="px-4 py-3">
                  پلاک
                </th>
                <th scope="col" className="px-4 py-3">
                  کد پستی
                </th>
                <th scope="col" className="px-4 py-3">
                  محله
                </th>
                <th scope="col" className="px-4 py-3">
                  شهر
                </th>
                <th scope="col" className="px-4 py-3">
                  استان
                </th>
                <th scope="col" className="px-4 py-3 rounded">
                  ادرس کامل
                </th>
              </tr>
            </thead>
            <tbody>
              {address.map((item) => (
                <tr className="bg-white border-b" key={item._id}>
                  <td className="px-6 py-4 flex justify-center items-cente">
                    <button className="flex justify-center items-center gap-x-2">
                      <FontAwesomeIcon
                        className="hover:text-[--color-danger]"
                        icon="fa-solid fa-trash"
                        onClick={() => removeAddress(item._id)}
                      />
                      <FontAwesomeIcon
                        onClick={() => navigate(`/address/${item._id}`)}
                        className="hover:text-[--color-main]"
                        icon="fa-solid fa-pen-to-square"
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">{item.address.unit}</td>
                  <td className="px-6 py-4">{item.address.building_number}</td>
                  <td className="px-6 py-4">{item.address.postal_code}</td>
                  <td className="px-6 py-4">{item.address.neighborhood}</td>
                  <td className="px-6 py-4">{item.address.city}</td>
                  <td className="px-6 py-4">{item.address.province}</td>
                  <td className="px-6 py-4">
                    {item.address.full_address}
                    {item.address.is_default ? (
                      <span className="text-[--color-main] text-[10px] ml-2">
                        <FontAwesomeIcon icon="fa-solid fa-star-of-life" />
                      </span>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full xl:w-2/5 flex-col justify-center items-center xl:mx-12">
        <div className="w-full text-end">
          <div className="text-2xl mb-3 text-end my-5 pb-5">
            <Title partone="ثبت" parttwo="نشانی" />
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full xl:w-1/2 px-3 mb-6 xl:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                آدرس کامل
              </label>
              <input
                className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-full-address"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                type="text"
                placeholder="قم خیابان خیابان آزادی کوچه ... زنگ 1"
              />
            </div>
            <div className="w-full xl:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                نام و نام خوانوادگی گیرنده
              </label>
              <input
                className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="محمد حسینی"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-5">
            <div className="w-1/3 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                محله
              </label>
              <input
                className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                type="text"
                placeholder="امیرا آباد"
              />
            </div>
            <div className="w-1/3 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                شهر
              </label>
              <input
                className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                placeholder="تهران"
              />
            </div>

            <div className="w-1/3 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                استان
              </label>
              <input
                className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                type="text"
                placeholder="تهران"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-5">
            <div className="w-1/3 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                کد پستی
              </label>
              <input
                className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-postal-code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                type="text"
                placeholder="14165654"
              />
            </div>
            <div className="w-1/3 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                پلاک
              </label>
              <input
                className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-building-number"
                value={buildingNumber}
                onChange={(e) => setBuildingNumber(e.target.value)}
                type="text"
                placeholder="42"
              />
            </div>
            <div className="w-1/3 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                واحد
              </label>
              <input
                className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                type="text"
                placeholder="2"
              />
            </div>
          </div>
          <div className="flex w-full text-end justify-end items-center">
            <label className="block uppercase tracking-wide text-gray-700 text-xs mx-2 font-bold">
              ادرس اصلی
            </label>
            <input
              id="grid-is-default"
              onChange={(e) => setIsDefault(!is_default)}
              type="checkbox"
            />
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full xl:w-2/2 px-3 mb-6 xl:mb-0">
              <div className="flex justify-end mt-4">
                <button
                  onClick={createAddress}
                  className="bg-[--color-black] text-white font-semibold text-sm px-6 py-3 transition-all hover:bg-[var(--color-main)] rounded"
                >
                  ثبت نشانی
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressPage;
