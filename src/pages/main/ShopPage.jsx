import React, { useEffect, useState } from 'react';

import Title from '../../components/main/TitleComponent';
import axios from 'axios';
import Product from '../../components/main/ProductComponent';

import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ShopPage() {
  const limit = 15;

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [stockStatus, setStockStatus] = useState('');
  const [size, setSize] = useState('');
  const [minProd, setMinProd] = useState('');
  const [maxProd, setMaxProd] = useState('');
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('search') || '';
    setSearch(searchParam);
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/product?page=${page}&limit=${limit}&stock_status=${stockStatus}&size=${size}&min_production=${minProd}&max_production=${maxProd}${
          queryParams.get('search') ? '&name=' + queryParams.get('search') : ''
        }&desc=true`,
      )
      .then((res) => {
        setTotalPages(res.data.body.totalPages);
        setProducts(res.data.body.data);
        setLoading(false);
      });
  }, [page, stockStatus, size, minProd, maxProd, location.search]);

  function setToFilter(e) {
    if (e.target.name == 'stock_status') setStockStatus(e.target.value);
    if (e.target.name == 'size') setSize(e.target.value);
    if (e.target.name == 'min_production') setMinProd(e.target.value);
    if (e.target.name == 'max_production') setMaxProd(e.target.value);
  }

  function resetFilter(e) {
    if (e.target.name == 'production') {
      setMinProd('');
      setMaxProd('');
      e.target.value == '';
      e.target.value == '';
    }
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  return (
    <div className="flex xl:flex-row gap-1 md:gap-10 pt-10 border-t justify-end flex-col-reverse">
      <div className="flex-1">
        <div className="flex justify-end text-lg sm:text-2xl mb-4 mt-4 sm:mt-2">
          <Title partone="تمامی" parttwo="محصولات" />
        </div>
        {loading ? (
          <div className="col-span-full text-center text-gray-500">در حال بارگذاری...</div>
        ) : (
          <>
            {products == 0 ? (
              <div className="text-center mt-5">
                <p className="text-gray-500 mt-2">محصولی پیدا نشد</p>
              </div>
            ) : (
              <div dir='rtl' className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 gap-y-6 ">
                {products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
        <div dir="rtl" className="flex justify-center gap-4 mt-6">
          {!loading && products.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-4 rtl">
              <button
                onClick={() => handlePageChange(page - 1)}
                className={`w-10 h-10 rounded border transition flex items-center justify-center ${
                  page === 1
                    ? 'bg-gray-100 text-[--color-gray] cursor-not-allowed '
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon="fa-solid fa-angle-right" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`${
                    num == page
                      ? 'bg-[var(--color-black)] text-[var(--color-white)]'
                      : 'border border-[var(--color-gray)] text-[var(--color-[--color-black])]'
                  } w-10 h-10 rounded flex justify-center items-center`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                className={`w-10 h-10 rounded border transition flex items-center justify-center ${
                  page === totalPages
                    ? 'bg-gray-100 text-[--color-gray] cursor-not-allowed '
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon="fa-solid fa-angle-left" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className=" md:min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2 justify-between xl:justify-end">
          <span
            onClick={() => setShowFilter(!showFilter)}
            className={`my-2 text-sm font-bold block xl:hidden ${
              showFilter ? 'text-[var(--color-danger)]' : 'text-[var(--color-black)]'
            }`}
          >
            {showFilter ? 'مخفی کردن فیلتر ها' : 'نمایش فیلتر ها'}
          </span>
          فیلتر ها
        </p>
        <div className={`xl:block ${showFilter ? '' : 'hidden'}`}>
          <div className="flex flex-col rounded text-right border border-[var(--color-dark-gray)] pl-5 py-3 px-5 mt-6">
            <p className="mb-3 text-sm font-medium">موجودی</p>
            <div className="flex flex-col gap-2 text-sm font-ligth items-end">
              <p className="flex gap-2">
                موجود
                <input
                  onClick={setToFilter}
                  name="stock_status"
                  type="radio"
                  className="w-3"
                  value="IN STOCK"
                />
              </p>
              <p className="flex gap-2">
                ناموجود
                <input
                  onClick={setToFilter}
                  name="stock_status"
                  type="radio"
                  className="w-3"
                  value="OUT OF STOCK"
                />
              </p>
              <p className="flex gap-2">
                ... بزودی
                <input
                  onClick={setToFilter}
                  name="stock_status"
                  type="radio"
                  className="w-3"
                  value="COMING SOON"
                />
              </p>
              <p className="flex gap-2">
                همه
                <input
                  onClick={setToFilter}
                  name="stock_status"
                  type="radio"
                  className="w-3"
                  value=""
                />
              </p>
            </div>
          </div>
          <div className="flex flex-col rounded items-end text-right border border-[var(--color-dark-gray)] pl-5 py-3 px-5 mt-6">
            <p className="mb-3 text-sm font-medium">سایز</p>
            <div className="flex flex-col gap-2 text-sm font-ligth items-end">
              <p className="flex gap-2">
                1/64
                <input
                  onClick={setToFilter}
                  name="size"
                  type="radio"
                  className="w-3"
                  value="1/64"
                />
              </p>
              <p className="flex gap-2">
                1/32
                <input
                  onClick={setToFilter}
                  name="size"
                  type="radio"
                  className="w-3"
                  value="1/32"
                />
              </p>
              <p className="flex gap-2">
                1/24
                <input
                  onClick={setToFilter}
                  name="size"
                  type="radio"
                  className="w-3"
                  value="1/24"
                />
              </p>
              <p className="flex gap-2">
                1/18
                <input
                  onClick={setToFilter}
                  name="size"
                  type="radio"
                  className="w-3"
                  value="1/18"
                />
              </p>
              <p className="flex gap-2">
                1/8
                <input onClick={setToFilter} name="size" type="radio" className="w-3" value="1/8" />
              </p>
              <p className="flex gap-2">
                همه
                <input onClick={setToFilter} name="size" type="radio" className="w-3" value="" />
              </p>
            </div>
          </div>
          <div className="flex flex-col rounded text-right border border-[var(--color-dark-gray)] pl-5 py-3 px-5 mt-6">
            <p className="mb-3 text-sm font-medium">سال تولید</p>
            <div className="flex flex-col gap-2 text-sm font-ligth items-end">
              <p className="flex gap-2">
                <input
                  onChange={setToFilter}
                  name="min_production"
                  type="number"
                  min="2000"
                  max="2025"
                  className="w-20 pl-3  text-center border-x border-[var(--color-black)]"
                  placeholder="2000"
                />
                از سال
              </p>
              <p className="flex gap-2 items-center">
                <input
                  onChange={setToFilter}
                  name="max_production"
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  className="w-20 pl-3 text-center border-x border-[var(--color-black)]"
                  placeholder={new Date().getFullYear()}
                />
                تا سال
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
