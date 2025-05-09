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
import { header_img, no_image_img } from '../../public/assets/images/images';
import { accordion } from '@material-tailwind/react';

function EditProductPage() {
  const admin_token = localStorage.getItem('admin_token');
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [reload, setReload] = useState(0);
  const [newProduct, setNewProduct] = useState({});
  const [showDiscount, setShowDiscount] = useState(false);
  const [removeDiscount, setRemoveDiscount] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesIds, setImagesIds] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/${productId}`);
        setProduct(res.data.body);
        setImagesIds(res.data.body.images);
      } catch (e) {
        toast.error(e?.response?.data?.message || 'خطا در دریافت محصول');
      }
    };

    fetchProduct();
  }, [productId, reload]);

  useEffect(() => {
    setImages([]);
    const fetchProductImages = async () => {
      if (!imagesIds?.length) return;

      try {
        for (let i = 0; i < imagesIds.length; i++) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/storage/${imagesIds[i]}`);
          const image = {
            id: imagesIds[i],
            data: res.data.body.data,
            contentType: res.data.body.contentType,
          };
          setImages((prev) => [...prev, image]);
        }
      } catch (e) {
        toast.error(e?.response?.data?.message || 'خطا در دریافت تصاویر محصول');
      }
    };

    fetchProductImages();
  }, [imagesIds]);

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
        { ...newProduct, images: imagesIds },
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
    const confirmed = confirm('آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟');
    if (!confirmed) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/product/${productId}`, {
        headers: { Authorization: admin_token },
      });

      if (res.status === 200 || res.status === 204) {
        toast.success('محصول با موفقیت حذف شد');
        navigate(-1);
      } else {
        toast.error('حذف با موفقیت انجام نشد');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'خطا در حذف محصول');
    }
  };

  const handleDeleteImage = (imageId) => {
    setImagesIds((prev) => prev.filter((id) => id !== imageId));
  };

  const renderImage = (data) => {
    if (!data) return no_image_img;
    return `data:${data?.contentType};base64,${data?.data}`;
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/storage`, formData, {
        headers: {
          Authorization: admin_token,
        },
      });

      toast.success('تصویر با موفقیت آپلود شد');
      return res.data.body[0]._id;
    } catch (e) {
      toast.error(e?.response?.data?.message || 'خطا در آپلود تصویر');
    }
  };

  const handleAddImage = (imageId) => {
    const filtered = imagesIds.filter((id) => id !== imageId);
    setImagesIds([...filtered, imageId]);
  };

  const handleChangeMainImage = (imageId) => {
    const filtered = imagesIds.filter((id) => id !== imageId);
    if (filtered.length === 0) setImagesIds([imageId]);
    filtered.shift();
    setImagesIds([imageId, ...filtered]);
  };

  console.log({ images, imagesIds });
  return (
    <div dir="rtl" className="flex flex-col justify-between items-center">
      {/* navigator */}
      <div className="flex justify-between lg:justify-start lg:gap-3 items-center w-full pb-10 pt-3 px-4 ">
        <h2 className=" text-xl font-bold text-[--color-black]">بروزرسانی محصول</h2>
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
      <div className="flex flex-col lg:flex-row gap-12 w-full">
        {/* update form */}
        <div className="flex justify-between items-center w-full lg:w-1/2">
          <div className="w-full">
            <section className="bg-white">
              <div className=" mx-auto">
                <div>
                  <div className="grid gap-4 mb-4 md:grid-cols-2 md:gap-6 md:mb-5">
                    {/* col 1 */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-md font-medium text-[--color-black]"
                      >
                        نام محصول
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                        value={newProduct.name}
                        placeholder={product.name}
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="brand"
                        className="block mb-2 text-md font-medium text-[--color-black]"
                      >
                        برند محصول
                      </label>
                      <input
                        type="text"
                        name="brand"
                        id="brand"
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                        value={newProduct.brand}
                        placeholder={product.brand}
                      />
                    </div>
                    {/* col 2 */}
                    <div className="relative">
                      <label
                        htmlFor="category"
                        className="block mb-2 text-md font-medium text-[--color-black]"
                      >
                        دسته‌بندی محصول
                      </label>
                      <select
                        id="category"
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        value={newProduct.category || product.category}
                        className="appearance-none bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded block w-full p-2.5 pr-10"
                      >
                        <option value="MODEL">مدل</option>
                        <option value="ACCESSORY">لوازم جانبی</option>
                        <option value="MYSTERY">شانسی</option>
                        <option value="OTHER">سایر محصولات</option>
                      </select>
                      <div className="pointer-events-none absolute top-12 right-3 transform -translate-y-1/2 text-[--color-gray] text-xs">
                        <FontAwesomeIcon
                          icon="fa-solid fa-chevron-down"
                          className="w-3 h-3 text-[--color-black] mt-[1px]"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="category"
                        className="block mb-2 text-md font-medium text-[--color-black]"
                      >
                        دسته‌بندی محصول
                      </label>
                      <select
                        id="category"
                        onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                        value={newProduct.size || product.size}
                        className="appearance-none bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded block w-full p-2.5 pr-10"
                      >
                        <option value="1/64">1/64</option>
                        <option value="1/24">1/24</option>
                        <option value="1/8">1/8</option>
                        <option value="1/18">1/18</option>
                        <option value="1/32">1/32</option>
                        <option value="1/43">1/43</option>
                      </select>
                      <div className="pointer-events-none absolute top-12 right-3 transform -translate-y-1/2 text-[--color-gray] text-xs">
                        <FontAwesomeIcon
                          icon="fa-solid fa-chevron-down"
                          className="w-3 h-3 text-[--color-black] mt-[1px]"
                        />
                      </div>
                    </div>
                    {/* col 3 */}
                    <div className="relative">
                      <label
                        htmlFor="category"
                        className="block mb-2 text-md font-medium text-[--color-black]"
                      >
                        موجودی
                      </label>
                      <select
                        id="category"
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, stock_status: e.target.value })
                        }
                        value={newProduct.stock_status || product.stock_status}
                        className="appearance-none bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded block w-full p-2.5 pr-10"
                      >
                        <option value="IN STOCK">موجود</option>
                        <option value="OUT OF STOCK">ناموجود</option>
                        <option value="COMING SOON">به زودی</option>
                      </select>
                      <div className="pointer-events-none absolute top-12 right-3 transform -translate-y-1/2 text-[--color-gray] text-xs">
                        <FontAwesomeIcon
                          icon="fa-solid fa-chevron-down"
                          className="w-3 h-3 text-[--color-black] mt-[1px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-md font-medium text-[--color-black]"
                      >
                        تعداد
                      </label>
                      <input
                        id="category"
                        type="number"
                        placeholder={product.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        value={newProduct.quantity}
                        className="bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                      />
                    </div>
                    {/* col 4 */}
                    <div>
                      <label
                        htmlFor="production"
                        className="block mb-2 text-md font-medium text-[--color-black]"
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
                        className="bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                        value={newProduct.production}
                      />
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="production"
                        className="block mb-2 text-md font-medium text-[--color-black]"
                      >
                        رنگ
                      </label>

                      <div className="flex items-center">
                        {/* Circle Color Preview */}
                        <div
                          onClick={() => document.getElementById('hiddenColorInput').click()}
                          className="w-10 h-10 rounded border border-[--color-gray] cursor-pointer transition-all duration-200  px-4 ml-2"
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
                          className="bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded focus:ring-[--color-main] focus:border-[--color-main] block p-2.5 w-full"
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
                        className="block mb-2 text-md font-medium text-[--color-black]"
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
                        className="bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5 pr-9 text-left"
                      />
                    </div>

                    {/* col 6 */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-md font-medium text-[--color-black]"
                      >
                        توضیحات
                      </label>
                      <textarea
                        id="description"
                        rows="8"
                        className="block p-2.5 w-full h-32 text-md text-[--color-black] bg-[--color-light-gray] rounded border border-[--color-gray] focus:ring-[--color-main] focus:border-[--color-main]"
                        placeholder={product.description}
                      />
                    </div>
                  </div>
                  {/* discount */}
                  <div className="flex flex-col gap-4">
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
                              className="block mb-2 text-md font-medium text-[--color-black]"
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
                              className="bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded focus:ring-[--color-main] focus:border-[--color-main] block w-full p-2.5"
                              value={newProduct?.discount?.percentage || 1}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="expirationDate"
                              className="block mb-2 text-md font-medium text-[--color-black]"
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
                              inputClass="w-full bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded focus:ring-[--color-main] focus:border-[--color-main] p-2.5 text-right"
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
                          className="bg-[--color-light-gray] border border-[--color-gray] text-[--color-black] text-md rounded focus:ring-[--color-main] focus:border-[--color-main] p-2.5"
                          value={removeDiscount}
                        />
                        <label
                          htmlFor="production"
                          className=" text-md font-medium text-[--color-black]"
                        >
                          حذف تخفیف
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        {/* images */}
        <div className="flex flex-col space-y-11 w-full  gap-4 md:w-1/2">
          <div className="flex flex-col">
            <div>
              <h3 className="text-sm font-medium mb-2">تصویر یکتا</h3>
            </div>
            <div className="relative w-72 aspect-square overflow-hidden rounded">
              <img
                src={renderImage(images[0])}
                alt="Header Preview"
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute ${imagesIds.length == 0 ? 'h-0' : 'h-1/2'} inset-0 text-[white]  bg-[--color-danger] opacity-0 hover:opacity-70 flex items-center justify-center  cursor-pointer transition-all`}
              >
                <label
                  onClick={() => handleDeleteImage(imagesIds[0])}
                  className="bg-[black]/40 text-white font-semibold text-base rounded-t w-full h-full flex flex-col text-center items-center justify-center cursor-pointer border-2 border-[--color-gray] border-dashed mx-auto"
                >
                  حذف
                  <p className="text-xs  text-[--color-light-gray] mt-2">حذف تصویر یکتا</p>
                </label>
              </div>
              <div
                className={`absolute ${imagesIds.length == 0 ? 'h-full' : 'h-1/2'} w-full bottom-0 text-[white] bg-[--color-main] opacity-0 hover:opacity-70 flex items-center justify-center cursor-pointer transition-all`}
              >
                <label
                  htmlFor="upload_main_img"
                  className="bg-[black]/40 text-white font-semibold text-base rounded-b w-full h-full flex flex-col text-center items-center justify-center cursor-pointer border-2 border-[--color-gray] border-dashed mx-auto"
                >
                  ویرایش
                  <input
                    type="file"
                    id="upload_main_img"
                    className="hidden"
                    onChange={async (e) => {
                      const imageId = await handleUploadImage(e);
                      if (imageId) handleChangeMainImage(imageId);
                    }}
                    accept="image/*"
                  />
                  <p className="text-xs text-[--color-light-gray] mt-2">PNG, JPG, SVG, WEBP</p>
                </label>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div>
              <h3 className="text-sm font-medium mb-2">تصاویر محصول</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6 w-full">
              {images.map((image, index) => {
                if (index === 0) return '';
                return (
                  <div
                    key={index}
                    className="relative w-full aspect-square overflow-hidden rounded"
                  >
                    <img
                      src={renderImage(image)}
                      alt="Header Preview"
                      className="w-full h-full object-cover"
                    />
                    <div
                      onClick={() => {}}
                      className="absolute inset-0 text-[white] bg-[--color-danger] opacity-0 hover:opacity-70 flex items-center justify-center  cursor-pointer transition-opacity"
                    >
                      <label
                        onClick={() => handleDeleteImage(image.id)}
                        className="bg-[black]/40 text-white font-semibold text-base rounded w-full h-full flex flex-col text-center items-center justify-center cursor-pointer border-2 border-[--color-gray] border-dashed mx-auto"
                      >
                        <FontAwesomeIcon icon="trash" className="text-lg" />
                      </label>
                    </div>
                  </div>
                );
              })}

              <div className="relative w-full aspect-square overflow-hidden rounded">
                <label
                  htmlFor="upload_images"
                  className="bg-white text-[--color-gray] font-semibold text-base rounded w-full h-full flex flex-col text-center items-center justify-center cursor-pointer border-2 border-[--color-gray] border-dashed mx-auto"
                >
                  بارگزاری
                  <input
                    type="file"
                    id="upload_images"
                    className="hidden"
                    onChange={async (e) => {
                      const imageId = await handleUploadImage(e);
                      if (imageId) handleAddImage(imageId);
                    }}
                    accept="image/*"
                  />
                  <p className="text-xs font-medium text-[--color-gray] mt-2">PNG, JPG SVG, WEBP</p>
                </label>
              </div>
              {/* می‌تونی این قسمت رو برای عکس‌های بیشتر تکرار کنی */}
            </div>
          </div>
        </div>
      </div>
      {/* update and delete button */}
      <div className="flex items-start w-full gap-4 mt-8">
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
  );
}

export default EditProductPage;
