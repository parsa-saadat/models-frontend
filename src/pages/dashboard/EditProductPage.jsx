import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

import { toast } from 'react-toastify';
import { toman_icon } from '../../public/assets/icons/icons';
import Product from '../../components/main/ProductComponent';

function EditProductPage() {
  const admin_token = localStorage.getItem('admin_token');
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [newProduct, setNewProduct] = useState({});
  const [showDiscount, setShowDiscount] = useState(false);
  const [removeDiscount, setRemoveDiscount] = useState(false);
  const [newImagesData, setNewImagesData] = useState([]);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/${productId}`);
        setProduct(res.data.body);
      } catch (e) {
        toast.error(e?.response?.data?.message || 'خطا در دریافت محصول');
      }
    };

    fetchProduct();
  }, [productId, reload]);

  const handleSubmit = async () => {
    if (showDiscount) {
      const { percentage, expirationDate } = newProduct.discount || {};
      if ((!expirationDate || !percentage) && !removeDiscount) {
        toast.error('لطفا تخفیف را کامل وارد کنید');
        return;
      }
    }
    newProduct.price ? (newProduct.price = parseInt(newProduct.price * 10)) : null;
    if (removeDiscount) {
      newProduct.discount = null;
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/product/${productId}`,
        { ...newProduct },
        { headers: { Authorization: admin_token } },
      );
      setNewProduct({});
      toast.success('محصول با موفقیت به‌روزرسانی شد');
      setReload(reload + 1);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/products/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newProduct.id }),
      });
      if (!response.ok) throw new Error('خطا در حذف');
      toast.success('محصول با موفقیت حذف شد');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div dir="rtl" className="flex flex-col justify-between items-center">
      <div className="flex justify-between md:justify-start md:gap-3 items-center w-full py-3">
        <h2 className=" text-xl font-bold text-gray-900">بروزرسانی محصول</h2>
        <span
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-md text-[--color-gray] cursor-pointer"
        >
          بازگشت
          <FontAwesomeIcon
            icon="fa-solid fa-caret-left"
            className={`text-md transition-transform duration-300`}
          />
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-12 px-4 w-full">
        <div className="flex justify-between items-center w-full md:w-1/2">
          <div className="w-full">
            <section className="bg-white">
              <div className=" pt-5 mx-auto">
                <div>
                  <div className="grid gap-4 mb-4 md:grid-cols-2 md:gap-6 md:mb-5">
                    {/* col 1 */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        نام محصول
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                        value={newProduct.name}
                        placeholder={product.name}
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="brand"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        برند محصول
                      </label>
                      <input
                        type="text"
                        name="brand"
                        id="brand"
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                        value={newProduct.brand}
                        placeholder={product.brand}
                      />
                    </div>
                    {/* col 2 */}
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        دسته‌بندی محصول
                      </label>
                      <select
                        id="category"
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        value={newProduct.category || product.category}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                      >
                        <option value="MODEL">مدل</option>
                        <option value="ACCESSORY">لوازم جانبی</option>
                        <option value="MYSTERY">شانسی</option>
                        <option value="OTHER">سایر محصولات</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        دسته‌بندی محصول
                      </label>
                      <select
                        id="category"
                        onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                        value={newProduct.size || product.size}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                      >
                        <option value="1/64">1/64</option>
                        <option value="1/24">1/24</option>
                        <option value="1/8">1/8</option>
                        <option value="1/18">1/18</option>
                        <option value="1/32">1/32</option>
                        <option value="1/43">1/43</option>
                      </select>
                    </div>
                    {/* col 3 */}
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        موجودی
                      </label>
                      <select
                        id="category"
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, stock_status: e.target.value })
                        }
                        value={newProduct.stock_status || product.stock_status}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                      >
                        <option value="IN STOCK">موجود</option>
                        <option value="OUT OF STOCK">ناموجود</option>
                        <option value="COMING SOON">به زودی</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        تعداد
                      </label>
                      <input
                        id="category"
                        type="number"
                        placeholder={product.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        value={newProduct.quantity}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                      />
                    </div>
                    {/* col 4 */}
                    <div>
                      <label
                        htmlFor="production"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        سال تولید
                      </label>
                      <input
                        type="number"
                        name="production"
                        id="production"
                        min="1900"
                        max={new Date().getFullYear()}
                        placeholder={product.production}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, production: e.target.value })
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                        value={newProduct.production}
                      />
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="production"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        رنگ
                      </label>

                      <div className="flex items-center">
                        {/* Circle Color Preview */}
                        <div
                          onClick={() => document.getElementById('hiddenColorInput').click()}
                          className="w-10 h-10 rounded border border-gray-300 cursor-pointer transition-all duration-200  px-4 ml-2"
                          style={{
                            backgroundColor: newProduct.color || product.color || '#191919',
                          }}
                        ></div>

                        {/* Hidden Color Input */}
                        <input
                          type="color"
                          id="hiddenColorInput"
                          className="absolute w-0 h-0 opacity-0"
                          onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                          value={newProduct.color || product.color || '#191919'}
                        />

                        {/* Text Input for Hex Code */}
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block p-2.5 w-full"
                          value={newProduct.color || product.color || '#191919'}
                          onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                          placeholder="#191919"
                        />
                      </div>
                    </div>

                    {/* col 5 */}
                    <div className="md:col-span-2 relative">
                      <label
                        htmlFor="price"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        قیمت
                      </label>

                      {/* آیکون تومان */}
                      <img
                        src={toman_icon}
                        className="w-5 h-5 opacity-50 absolute right-3 top-10 pointer-events-none"
                        alt="تومان"
                      />

                      {/* ورودی عدد قیمت */}
                      <input
                        id="price"
                        type="text"
                        placeholder={
                          product?.price ? (product.price / 10).toLocaleString() : 'مثلاً ۵۰۰٬۰۰۰'
                        }
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: Number(e.target.value.replace(/,/g, '')),
                          })
                        }
                        value={newProduct?.price ? newProduct.price.toLocaleString() : ''}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5 pr-9 text-left"
                      />
                    </div>

                    {/* col 6 */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        توضیحات
                      </label>
                      <textarea
                        id="description"
                        rows="8"
                        className="block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-[--color-main] focus:border-[--color-main]"
                        placeholder={product.description}
                      />
                    </div>
                  </div>
                  {/* discount */}
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-row justify-between items-center text-base mb-2">
                      <span>تخفیف</span>
                      <span
                        className={`text-md flex flex-row gap-2 items-center cursor-pointer ${showDiscount ? 'text-[--color-danger]' : 'text-[--color-gray]'}`}
                        onClick={() => {
                          if (showDiscount) {
                            const { discount, ...rest } = newProduct;
                            setNewProduct(rest);
                          }
                          setShowDiscount(!showDiscount);
                        }}
                      >
                        <span>{showDiscount ? 'لغو تخفیف' : 'نمایش'}</span>
                        <FontAwesomeIcon
                          icon="fa-solid fa-caret-up"
                          className={`text-md transition-transform duration-300 ${showDiscount ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </div>

                    <div
                      className={`gap-4 mb-4 md:grid-cols-2 md:gap-6  ${showDiscount ? 'grid' : 'hidden'}`}
                    >
                      {/* درصد تخفیف */}
                      {removeDiscount ? (
                        ''
                      ) : (
                        <>
                          <div>
                            <label
                              htmlFor="discount_percentage"
                              className="block mb-2 text-md font-medium text-gray-900"
                            >
                              درصد تخفیف
                            </label>
                            <input
                              type="number"
                              name="percentage"
                              id="discount_percentage"
                              min="1"
                              max="100"
                              onChange={(e) => {
                                let val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || '';
                                if (val > 100) val = 100;
                                if (val < 1 && val !== '') val = 1;
                                setNewProduct({
                                  ...newProduct,
                                  discount: {
                                    ...newProduct.discount,
                                    percentage: val,
                                  },
                                });
                              }}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                              value={newProduct?.discount?.percentage || 1}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="expirationDate"
                              className="block mb-2 text-md font-medium text-gray-900"
                            >
                              تاریخ انقضای تخفیف
                            </label>

                            <DatePicker
                              calendar={persian}
                              locale={persian_fa}
                              calendarPosition="bottom-right"
                              format="YYYY/MM/DD"
                              value={newProduct?.discount?.expirationDate}
                              onChange={(date) => {
                                const gregorianDate = date?.toDate()?.toISOString() || '';
                                setNewProduct({
                                  ...newProduct,
                                  discount: {
                                    ...newProduct.discount,
                                    expirationDate: gregorianDate,
                                  },
                                });
                              }}
                              inputClass="w-full bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] p-2.5 text-right"
                              containerClassName="w-full"
                              placeholder="انتخاب تاریخ شمسی"
                            />
                          </div>
                        </>
                      )}
                      <div className="flex w-full items-center gap-2 justify-start">
                        <input
                          type="checkbox"
                          name="remove_discount"
                          id="remove_discount"
                          onChange={(e) => setRemoveDiscount(!removeDiscount)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-[--color-main] focus:border-[--color-main] p-2.5"
                          value={removeDiscount}
                        />
                        <label htmlFor="production" className=" text-md font-medium text-gray-900">
                          حذف تخفیف
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleSubmit()}
                      className="bg-[--color-main] text-white px-4 py-2 rounded   hover:bg-[--color-black] hover:text-white"
                    >
                      بروزرسانی محصول
                    </button>
                    <button
                      onClick={() => handleDelete()}
                      className="bg-[--color-black] text-white px-4 py-2 rounded  hover:bg-[--color-danger] hover:text-white"
                    >
                      حذف محصول
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end gap-4 sm:w-1/2">
          <div></div>
          <div className="w-full sm:w-1/2 flex flex-col justify-center items-center">
            <div className="w-full">
              <Product product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProductPage;
