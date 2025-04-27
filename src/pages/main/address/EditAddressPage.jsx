import React, { useEffect, useState } from 'react';
import Title from '../../../components/main/TitleComponent';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function EditAddressPage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();
  const { addressId } = useParams();

  const [fullAddress, setFullAddress] = useState('');
  const [newFullAddress, setNewFullAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [province, setProvince] = useState('');
  const [newProvince, setNewProvince] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [newBuildingNumber, setNewBuildingNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [newCity, setNewCity] = useState('');
  const [unit, setUnit] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${user._id}/address/${addressId}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setFullAddress(res.data.body.address.full_address);
        setFullName(res.data.body.address.full_name);
        setProvince(res.data.body.address.province);
        setBuildingNumber(res.data.body.address.building_number);
        setNeighborhood(res.data.body.address.neighborhood);
        setCity(res.data.body.address.city);
        setUnit(res.data.body.address.unit);
        setPostalCode(res.data.body.address.postal_code);
        setIsDefault(res.data.body.address.is_default);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, []);

  const updateAddress = () => {
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/address/${addressId}`,
        {
          address: {
            full_address: newFullAddress ? newFullAddress : undefined,
            full_name: newFullName ? newFullName : undefined,
            province: newProvince ? newProvince : undefined,
            building_number: newBuildingNumber ? newBuildingNumber : undefined,
            neighborhood: newNeighborhood ? newNeighborhood : undefined,
            city: newCity ? newCity : undefined,
            unit: newUnit ? newUnit : undefined,
            postal_code: newPostalCode ? newPostalCode : undefined,
            is_default: isDefault,
          },
        },
        { headers: { Authorization: token } },
      )
      .then((r) => {
        toast.success('آدرس با موفقیت ویرایش شد');
        navigate('/address');
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  return (
    <div className="flex justify-center items-center xl:mx-12 xl:pt-44 pb-1 h-screen xl:h-auto">
      <div className="text-end">
        <div className="text-2xl mb-3 text-end my-5 pb-5">
          <Title partone="ویرایش" parttwo="نشانی" />
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full xl:w-1/2 px-3 mb-6 xl:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              آدرس کامل
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-full-address"
              value={newFullAddress}
              onChange={(e) => setNewFullAddress(e.target.value)}
              type="text"
              placeholder={fullAddress}
            />
          </div>
          <div className="w-full xl:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              نام و نام خوانوادگی گیرنده
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-full-name"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              type="text"
              placeholder={fullName}
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
              value={newNeighborhood}
              onChange={(e) => setNewNeighborhood(e.target.value)}
              type="text"
              placeholder={neighborhood}
            />
          </div>
          <div className="w-1/3 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              شهر
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-city"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              type="text"
              placeholder={city}
            />
          </div>

          <div className="w-1/3 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              استان
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-province"
              value={newProvince}
              onChange={(e) => setNewProvince(e.target.value)}
              type="text"
              placeholder={province}
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
              value={newPostalCode}
              onChange={(e) => setNewPostalCode(e.target.value)}
              type="text"
              placeholder={postalCode}
            />
          </div>
          <div className="w-1/3 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              پلاک
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-building-number"
              value={newBuildingNumber}
              onChange={(e) => setNewBuildingNumber(e.target.value)}
              type="text"
              placeholder={buildingNumber}
            />
          </div>
          <div className="w-1/3 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              واحد
            </label>
            <input
              className="text-end appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-unit"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              type="text"
              placeholder={unit}
            />
          </div>
        </div>
        <div className="flex w-full text-end justify-end items-center">
          <label className="block uppercase tracking-wide text-gray-700 text-xs mx-2 font-bold">
            ادرس اصلی
          </label>
          <input
            id="grid-is-default"
            onChange={() => setIsDefault(!isDefault)}
            type="checkbox"
            checked={isDefault}
          />
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full xl:w-2/2 px-3 mb-6 xl:mb-0">
            <div className="flex justify-end mt-4">
              <button
                onClick={updateAddress}
                className="bg-[--color-black] text-white font-semibold text-sm px-6 py-3 transition-all hover:bg-[var(--color-main)] rounded"
              >
                ویرایش نشانی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAddressPage;
