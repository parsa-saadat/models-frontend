import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, redirect, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toman_icon } from '../../../public/assets/icons/icons';
import { no_image_img } from '../../../public/assets/images/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SingleOrderPage() {
  const token = localStorage.getItem('token');
  const { orderId } = useParams();

  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
        headers: { Authorization: token },
      })
      .then((r) => {
        setOrder(r.data.body);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message);
      });
  }, [orderId]);

  useEffect(() => {
    if (!order.items) return;

    const fetchProducts = async () => {
      try {
        const updatedProducts = await Promise.all(
          order.items.map(async (item) => {
            const productRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/product/${item._id}`,
            );
            const product = productRes.data.body;

            if (product.images?.length) {
              try {
                const imgId = product.images[0];
                const imageRes = await axios.get(
                  `${import.meta.env.VITE_API_URL}/storage/${imgId}`,
                );

                product.loadedImage = `data:${imageRes.data.body.contentType};base64,${imageRes.data.body.data}`;
              } catch (e) {
                toast.error('خطا در بارگذاری تصویر محصول');
                product.loadedImage = null;
              }
            }

            return product;
          }),
        );

        setProducts(updatedProducts);
      } catch (e) {
        toast.error(e.response?.data?.message || 'خطا در دریافت اطلاعات محصولات');
      }
    };

    fetchProducts();
  }, [order]);

  const orderStatusToFa = (status) => {
    switch (status) {
      case 'pending':
        return ' در انتظار پرداخت';
      case 'processing':
        return 'در حال پردازش';
      case 'delivered':
        return 'تحویل داده شده';
      case 'canceled':
        return 'لغو شده';
      case 'shipped':
        return 'ارسال شده';
      case 'send':
        return 'ارسال شده';
      default:
        return status;
    }
  };

  const pay = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/pay?orderId=${order._id}`,
        {},
        {
          headers: { Authorization: token },
        },
      );

      window.open(res.data.body.url, '_blank');
    } catch (e) {
      toast.error(e.response?.data?.message || 'خطا در پرداخت');
    }
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div
        className={` ${
          showAddress ? 'fixed' : 'hidden'
        } top-0 right-0 w-screen h-screen bg-black/80 flex items-center justify-center`}
      >
        <div dir="rtl" className=" rounded p-6 text-sm flex flex-col bg-white  m-10 gap-6">
          <div className="flex justify-between">
            <h3 className="text-lg">نشانی سفارش</h3>
            <FontAwesomeIcon
              onClick={() => setShowAddress(false)}
              icon="close"
              className="text-lg hover:text-[--color-danger] cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <strong>گیرنده:</strong> {order.shipping?.shipping_address?.full_name}
            </div>
            <div>
              <strong>استان:</strong> {order.shipping?.shipping_address?.province}
            </div>
            <div>
              <strong>شهر:</strong> {order.shipping?.shipping_address?.city}
            </div>
            <div>
              <strong>محله:</strong> {order.shipping?.shipping_address?.neighborhood}
            </div>
            <div>
              <strong>پلاک:</strong> {order.shipping?.shipping_address?.building_number}
            </div>
            <div>
              <strong>واحد:</strong> {order.shipping?.shipping_address?.unit}
            </div>

            <div>
              <strong>آدرس:</strong> {order.shipping?.shipping_address?.full_address}
            </div>
            <div>
              <strong>کد پستی:</strong> {order.shipping?.shipping_address?.postal_code}
            </div>
          </div>
          <div className="flex justify-start items-center gap-2 text-[--color-danger]">
            <FontAwesomeIcon icon="fa-solid fa-circle-exclamation" className="text-base" />
            <p>اگر نشانی وارد شده نادرست است یا نیاز به تغییر دارد با پشتیبانی تماس بگیرید</p>
          </div>
        </div>
      </div>
      <div className="text-end flex flex-col-reverse md:flex-row gap-10 justify-center w-full ">
        <div className="w-full md:w-6/12 lg:w-2/5 xl:w-3/12">
          <div className="bg-[--color-light-gray] rounded ">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{order._id} شناسه</h3>
              <p
                onClick={() => setShowAddress(true)}
                className="cursor-pointer mt-1 max-w-2xl text-sm text-[--color-gray] flex items-center justify-end gap-1"
              >
                اطلاعات نشانی
                <FontAwesomeIcon
                  icon="fa-solid fa-location-crosshairs"
                  className="text-lg text-[--color-main] "
                />{' '}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-white px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span>{new Date(order.create_at).toLocaleString('fa-IR')}</span>{' '}
                  </dd>
                  <dt className="text-sm font-medium text-gray-500">تاریخ ثبت</dt>
                </div>
                <div className="bg-[--color-light-gray] px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-end gap-x-2">
                    <img src={toman_icon} className="w-4 h-4" />
                    {(
                      (order?.payment?.amount +
                        order?.shipping?.shipping_cost -
                        order?.payment?.discount_applied) /
                      10
                    ).toLocaleString()}
                  </dd>
                  <dt className="text-sm font-medium text-gray-500">هزینه کل</dt>
                </div>
                <div className="bg-white px-4 py-5 sm:grid grid-cols-3 sm:gap-4 sm:px-6">
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-end gap-x-2">
                    <img src={toman_icon} className="w-4 h-4" />
                    {(order?.shipping?.shipping_cost / 10)?.toLocaleString()}
                  </dd>
                  <dt className="text-sm font-medium text-gray-500">هزینه ارسال</dt>
                </div>
                <div className=" px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {orderStatusToFa(order?.status)}
                  </dd>
                  <dt className="text-sm font-medium text-gray-500">وضعیت سفارش</dt>
                </div>
                {order.status !== 'delivered' && (
                  <>
                    <div className="bg-white px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
                        {new Date(order.shipping?.estimated_delivery).toLocaleDateString('fa-IR')}
                      </dd>
                      <dt className="text-sm font-medium text-gray-500">تحویل تقریبی</dt>
                    </div>
                    <div className="bg-[--color-light-gray] px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ">
                        {order.shipping?.tracking_code || '-'}
                      </dd>
                      <dt className="text-sm font-medium text-gray-500">کد رهگیری</dt>
                    </div>
                  </>
                )}

                <div className="bg-white px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order?.customer_notes || '-'}
                  </dd>
                  <dt className="text-sm font-medium text-gray-500">توضیحات</dt>
                </div>
              </dl>
            </div>
          </div>
          <div>
            {order?.payment?.status !== 'paid' ? (
              <button
                onClick={pay}
                className="w-full bg-[--color-black] text-white font-semibold text-xs px-5 py-3 md:py-3 md:px-6 md:text-xs transition-all hover:bg-[var(--color-success)] rounded-b"
              >
                پرداخت
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-[--color-gray] text-white font-semibold text-xs px-2 py-3 md:py-3 md:px-6 md:text-xs transition-all rounded-b"
              >
                پرداخت شده
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {order?.items?.map((item, index) => {
            const product = products[index];
            return (
              <Link to={`/product/${product._id}`} key={item._id}>
                <div
                  key={item._id}
                  className="flex flex-row-reverse items-center justify-center bg-[--color-light-gray] p-3 gap-x-3  rounded"
                >
                  <div className="w-20 h-20  ">
                    {product?.loadedImage ? (
                      <img
                        src={product.loadedImage}
                        alt={product.name}
                        className="w-full h-full rounded self-center object-cover"
                      />
                    ) : (
                      <img
                        src={no_image_img}
                        className="w-full h-full rounded self-center object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col w-full text-end items-end justify-start">
                    <div className="flex gap-x-1 items-center text-sm">
                      <span className="text-[10px] text-[--color-gray]">{product?.brand}</span>-{' '}
                      <span>{product?.name}</span>
                    </div>

                    <div className="text-sm text-gray-700">سایز: {item.size}</div>

                    <div className="flex gap-3 text-sm text-gray-800">
                      {item.discount ? (
                        <span className="text-[var(--color-[--color-black])] flex gap-x-1 items-center">
                          <img src={toman_icon} className="w-4 h-4" alt="تومان" />
                          {(
                            (item.price * item.quantity - item.discount * item.quantity) /
                            10
                          ).toLocaleString()}
                          <span className="mx-2 text-[var(--color-[--color-black])]">-</span>
                          <span className="line-through text-[--color-danger]">
                            {((item.price * item.quantity) / 10).toLocaleString()}
                          </span>
                        </span>
                      ) : (
                        <span className="flex gap-x-1 items-center">
                          <img src={toman_icon} className="w-4 h-4" alt="تومان" />
                          {item.price}
                        </span>
                      )}
                      <span>تعداد: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SingleOrderPage;
