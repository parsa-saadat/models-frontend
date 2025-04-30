import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { no_image_img } from '../../../public/assets/images/images';
import Title from '../../../components/main/TitleComponent';
import { Link } from 'react-router-dom';

function OrdersPage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 5;

  useEffect(() => {
    const fetchOrdersWithDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${
            user._id
          }/orders?page=${page}&limit=${4}&desc=true`,
          {
            headers: { Authorization: token },
          },
        );

        const ordersData = res.data.body.data;
        setTotalPages(res.data.body.totalPages);

        const enrichedOrders = await Promise.all(
          ordersData.map(async (order) => {
            const itemsWithImages = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const productRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/product/${item._id}`,
                    { headers: { Authorization: token } },
                  );

                  const product = productRes.data.body;
                  let imageSrc = no_image_img;

                  if (product?.images?.[0]) {
                    const imageRes = await axios.get(
                      `${import.meta.env.VITE_API_URL}/storage/${product.images[0]}`,
                      { headers: { Authorization: token } },
                    );

                    imageSrc = `data:${imageRes.data.body.contentType};base64,${imageRes.data.body.data}`;
                  }

                  return { ...item, product, imageSrc };
                } catch (err) {
                  return { ...item, product: null, imageSrc: no_image_img };
                }
              }),
            );

            return { ...order, items: itemsWithImages };
          }),
        );

        setOrders(enrichedOrders);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        toast.error(e.response?.data?.message || 'خطا در دریافت سفارشات');
      }
    };

    if (token && user?._id) {
      fetchOrdersWithDetails();
    }
  }, [token, user?._id, page]);

  const pay = async (orderId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/pay?orderId=${orderId}`,
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

  return (
    <div className=" flex flex-col justify-center mt-10 lg:mt-24 lg:ml-40 lg:mr-40">
      <div className="text-center text-2xl mb-10">
        <Title partone="سفارش" parttwo="ها" />
      </div>
      <div className="text-end">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">در حال بارگذاری...</div>
        ) : orders.length == 0 ? (
          <div className="col-span-full text-center text-gray-500">سفارشی یافت نشد</div>
        ) : (
          orders.map((order) => (
            <Link to={`/order/${order._id}`} key={order._id}>
              <div
                key={order._id}
                className="border rounded p-4 mb-4 flex flex-col sm:flex-row-reverse items-center"
              >
                <div className=" grid-cols-2 grid-rows-2 gap-2 w-full sm:w-32 grid mb-2 sm:mb-0">
                  {[...Array(4)].map((_, idx) => {
                    const item = order.items[idx];
                    return (
                      <div
                        key={idx}
                        className="bg-gray-100 flex items-center justify-center aspect-square"
                      >
                        {item ? (
                          <img
                            src={item.imageSrc}
                            alt="product"
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-xs text-gray-300"></span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="w-full px-2 py-3">
                  <div className="text-xs pb-2">{orderStatusToFa(order.status)}</div>
                  {order.payment.status == 'paid' ? (
                    <div className="text-[--color-success] font-bold text-xs">پرداخت شده</div>
                  ) : (
                    <div className="text-[--color-danger] font-bold text-xs">پرداخت نشده</div>
                  )}
                  <div className="text-gray text-xs pt-2">
                    <span>{order._id}</span> <span>: شناسه</span>
                  </div>
                  <div className="text-gray text-xs">
                    <span>{new Date(order.create_at).toLocaleDateString('fa-IR')}</span>
                    <span>: تاریخ</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center  gap-2 w-full sm:w-52">
                  {order.payment.status !== 'paid' ? (
                    <button
                      onClick={() => pay(order._id)}
                      className="w-full  bg-[--color-black] text-white font-semibold text-xs px-5 py-3 md:py-3 md:px-6 md:text-xs transition-all hover:bg-[var(--color-success)] rounded"
                    >
                      پرداخت
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-[--color-success] text-white font-semibold text-xs px-2 py-3 md:py-3 md:px-6 md:text-xs transition-all hover:bg-[var(--color-gray)] rounded"
                    >
                      پرداخت شده
                    </button>
                  )}
                  <button className="w-full  border text-[--color-black] font-semibold text-xs px-5 py-3 md:py-3 md:px-6 md:text-xs transition-all hover:bg-[var(--color-main)] hover:text-white rounded">
                    جزئیات
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`${
              page === i + 1
                ? 'bg-[var(--color-[--color-black])] text-[var(--color-white)]'
                : 'border border-[var(--color-gray)] text-[var(--color-[--color-black])]'
            } w-10 h-10 rounded flex justify-center items-center`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;
