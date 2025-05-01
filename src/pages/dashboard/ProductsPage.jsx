import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { contact_img } from '../../public/assets/images/images';
import DashboardProductComponent from '../../components/dashboard/ProductComponent';

function ProductsPage() {
  const admin_token = localStorage.getItem('admin_token');
  const limit = 20;
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [desc, setDesc] = useState(true);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/product?${
            search ? `name=${search}` : ''
          }${desc ? '&desc=true' : ''}&page=${page}&limit=${limit}`,
          {
            headers: { Authorization: admin_token },
          },
        );
        setProducts(res.data.body?.data || []);
        setTotalPages(res.data.body?.totalPages || 0);
        setLoading(false);
      } catch (e) {
        console.log(e);
        toast.error(e.response?.data?.message || 'خطا در دریافت محصولات');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, reload, desc]);

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
                  placeholder="جستجو..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setReload(reload + 1);
                    }
                  }}
                  className="text-right pr-9 px-2 w-full h-full outline-none"
                />
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

      {loading ? (
        <div className="col-span-full text-center text-gray-500">در حال بارگذاری...</div>
      ) : products.length == 0 ? (
        <div className="col-span-full text-center text-gray-500">محصولی یافت نشد</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {products.map((product) => (
            <DashboardProductComponent product={product} key={product._id} />
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4 rtl">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
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
            disabled={page === totalPages}
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

export default ProductsPage;
