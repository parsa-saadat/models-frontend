import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function AddressPage() {
  const admin_token = localStorage.getItem('admin_token');
  const limit = 30;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [desc, setDesc] = useState(true);
  const [userId, setUserId] = useState('');
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/address/?limit=${limit}&page=${page}${desc ? '&desc=true' : ''}${
            userId ? `&userId=${userId}` : ''
          }`,
          {
            headers: {
              Authorization: admin_token,
            },
          },
        );

        setAddress(res.data.body.data);
        setTotalPages(res.data.body.totalPages);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        toast.error(e?.response?.data?.message || 'خطا در دریافت داده');
      }
    };

    fetchAddresses();
  }, [reload, desc, page]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border rounded p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">فیلتر</h3>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Select */}
            <div>
              <div className="relative border border-gray-300 rounded px-2 py-2 flex items-center justify-center outline-none">
                <input
                  placeholder="... 67af73568be11cb"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                  }}
                  className="text-left px-2 w-full h-full outline-none"
                />
                <FontAwesomeIcon icon="fa-solid fa-user" className="text-[--color-main] text-sm" />
                {/* search button */}
                <div
                  onClick={() => setReload(reload + 1)}
                  className="absolute right-0 h-full flex items-center justify-center p-3 bg-[--color-main] rounded-r text-white cursor-pointer"
                >
                  <FontAwesomeIcon icon="search" />
                </div>
              </div>
            </div>
            {/* Sort Button */}
            <button
              onClick={() => setDesc(!desc)}
              className="bg-[--color-main] text-white px-4 py-2 rounded w-full md:w-52 hover:bg-[--color-black]"
            >
              {desc ? 'مرتب‌سازی : قدیمی‌ترین' : 'مرتب‌سازی : جدیدترین'}
            </button>
          </div>
        </div>
      </div>

      {/* Address */}

      {loading ? (
        <div className="col-span-full text-center text-gray-500">در حال بارگذاری...</div>
      ) : address.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">هیچ آدرسی یافت نشد</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {address.map((item) => {
              const addr = item.address || {};
              return (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded p-5 transition flex flex-col gap-2"
                >
                  {/* Full Name */}
                  <div className="text-base font-semibold text-gray-800">
                    {addr.full_name || 'بدون نام'}
                  </div>

                  {/* Full Address */}
                  <div className="text-gray-600 text-sm">
                    <div>
                      <strong>آدرس کامل:</strong> {addr.full_address || '-'}
                    </div>
                    <div>
                      <strong>شهر:</strong> {addr.city || '-'}
                    </div>
                    <div>
                      <strong>استان:</strong> {addr.province || '-'}
                    </div>
                    <div>
                      <strong>محله:</strong> {addr.neighborhood || '-'}
                    </div>
                    <div>
                      <strong>پلاک:</strong> {addr.building_number || '-'}
                    </div>
                    <div>
                      <strong>واحد:</strong> {addr.unit || '-'}
                    </div>
                    <div>
                      <strong>کدپستی:</strong> {addr.postal_code || '-'}
                    </div>
                  </div>

                  {/* Default Address Tag */}
                  {addr.is_default && (
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded w-fit">
                      آدرس پیش‌فرض
                    </div>
                  )}

                  {/* Dates */}
                  <div className="text-gray-400 text-xs mt-2">
                    <div>ایجاد شده در: {new Date(item.create_at).toLocaleDateString('fa-IR')}</div>
                    <div>
                      آخرین بروزرسانی: {new Date(item.update_at).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && address.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4 rtl">
          <button
            onClick={() => handlePageChange(page - 1)}
            className={`w-10 h-10 rounded border transition ${
              page === 1
                ? 'bg-gray-100 text-[--color-gray] cursor-not-allowed '
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            قبلی
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`${
                num == page
                  ? 'bg-[var(--color-main)] text-[var(--color-white)]'
                  : 'border border-[var(--color-gray)] text-[var(--color-[--color-black])]'
              } w-10 h-10 rounded flex justify-center items-center`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            className={`w-10 h-10 rounded border transition ${
              page === totalPages
                ? 'bg-gray-100 text-[--color-gray] cursor-not-allowed '
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
export default AddressPage;
