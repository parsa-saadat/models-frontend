import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-toastify';
import { no_image_img } from '../../public/assets/images/images';
import { toman_icon } from '../../public/assets/icons/icons';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AdminOrders() {
  const admin_token = localStorage.getItem('admin_token');
  const limit = 20;
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [reload, setReload] = useState(0);
  const [desc, setDesc] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/orders?${
          status ? `status=${status}` : ''
        }${desc ? '&desc=true' : ''}&page=${page}&limit=${limit}`,
        {
          headers: { Authorization: admin_token },
        },
      )
      .then((res) => {
        setOrders(res.data.body?.data || []);
        setTotalPages(res.data.body?.totalPages || 0);
        setLoading(false);
      })
      .catch((err) => toast.error(err.response?.data?.message || 'خطا در دریافت سفارش‌ها'));
  }, [reload, status, desc, page]);

  useEffect(() => {
    if (!selectedOrder?.items?.length) return;

    const fetchProductDetails = async () => {
      const fullProducts = await Promise.all(
        selectedOrder.items.map(async (item) => {
          try {
            const productRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/product/${item._id}`,
              { headers: { Authorization: admin_token } },
            );
            const product = productRes.data.body;

            if (product.images?.length) {
              try {
                const imageRes = await axios.get(
                  `${import.meta.env.VITE_API_URL}/storage/${product.images[0]}`,
                  { headers: { Authorization: admin_token } },
                );
                product.loadedImage = `data:${imageRes.data.body.contentType};base64,${imageRes.data.body.data}`;
              } catch {
                product.loadedImage = null;
              }
            }

            return { ...item, product };
          } catch {
            return null;
          }
        }),
      );

      setOrderProducts(fullProducts.filter(Boolean));
    };

    fetchProductDetails();
  }, [selectedOrder]);

  const orderStatusToFa = (status) => {
    switch (status) {
      case 'pending':
        return 'در انتظار پرداخت';
      case 'processing':
        return 'در حال پردازش';
      case 'delivered':
        return 'تحویل داده شده';
      case 'canceled':
        return 'لغو شده';
      case 'shipped':
      case 'send':
        return 'ارسال شده';
      default:
        return status;
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const handleUpdateOrderStatus = async () => {
    try {
      const updated = {
        status: selectedOrder.status,
        tracking_code: selectedOrder.shipping?.tracking_code,
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${selectedOrder._id}`, updated, {
        headers: { Authorization: admin_token },
      });

      toast.success('تغییرات با موفقیت ذخیره شد');
      setSelectedOrder(null);
      setOrderProducts([]);
      setReload(reload + 1);
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border p-5 rounded space-y-3 md:space-y-0 md:items-center  flex flex-col md:flex-row justify-between bg-white">
        <h3 className="text-lg font-semibold text-gray-800">فیلتر</h3>
        <div className="flex flex-col space-y-4 md:flex-row md:gap-3 md:space-y-0">
          {/* فیلتر نقش */}
          <div className="relative w-full sm:w-56">
            <select
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[--color-main] focus:outline-none"
            >
              {/* status filters */}
              <option value="">همه وضعیت ها</option>
              <option value="pending">در انتظار پرداخت</option>
              <option value="processing">در حال پردازش</option>
              <option value="shipped">ارسال شده</option>
              <option value="delivered">تحویل داده شده</option>
              <option value="canceled">لغو شده</option>
            </select>
            <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-[--color-gray] text-xs">
              <FontAwesomeIcon
                icon="fa-solid fa-chevron-down"
                className="w-3 h-3 text-[--color-black] mt-[1px]"
              />
            </div>
          </div>

          {/* دکمه مرتب‌سازی */}
          <div>
            <button
              onClick={() => setDesc(!desc)}
              className="bg-[--color-main] text-white px-4 py-2 rounded w-full md:w-52  hover:bg-[--color-black] hover:text-white"
            >
              {desc ? 'مرتب‌سازی : قدیمی‌ترین' : 'مرتب‌سازی : جدید ترین'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="col-span-full text-center text-gray-500">در حال بارگذاری...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const statusColor =
              {
                processing: 'bg-yellow-100 text-yellow-700',
                delivered: 'bg-green-100 text-green-700',
                canceled: 'bg-red-100 text-red-700',
              }[order.status] || 'bg-gray-100 text-gray-700';

            const paymentColor =
              order.payment.status === 'paid'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700';

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded p-5 transition cursor-pointer flex flex-col justify-between"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded ${statusColor}`}>
                    {orderStatusToFa(order.status)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.create_at).toLocaleDateString('fa-IR')}
                  </span>
                </div>

                <div className="text-sm text-gray-800 space-y-1 mb-3">
                  <div>
                    <strong>گیرنده:</strong> {order.shipping?.shipping_address?.full_name || '-'}
                  </div>
                  <div>
                    <strong>تعداد آیتم:</strong> {order.items?.length || 0}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <strong>جمع کل:</strong>
                    <span className="font-bold text-black">
                      {(
                        (order.payment.amount +
                          order.shipping.shipping_cost -
                          order.payment.discount_applied) /
                        10
                      ).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      <img src={toman_icon} className="w-5 h-5" alt="" />
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1 border-t pt-3 mt-auto">
                  <div>
                    <strong>روش پرداخت:</strong> {order.payment.payment_gateway || '-'}
                  </div>
                  <div>
                    <strong>وضعیت پرداخت:</strong>
                    <span
                      className={`inline-block ml-1 px-2 py-0.5 rounded text-xs ${paymentColor}`}
                    >
                      {order.payment.status === 'paid' ? 'پرداخت شده' : 'پرداخت نشده'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* صفحه‌بندی */}
      {!loading && orders.length > 0 && (
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

      {/* Modal جزئیات سفارش */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null);
          setOrderProducts([]);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl bg-white rounded p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <FontAwesomeIcon
                icon="close"
                className="cursor-pointer hover:text-[--color-danger]"
                onClick={() => setSelectedOrder(null)}
              />
              <h3 className="text-xl font-bold text-gray-800 text-center flex">جزئیات سفارش</h3>
            </div>

            {selectedOrder && (
              <div className="space-y-6 text-right text-sm">
                {/* اطلاعات گیرنده و وضعیت سفارش */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className=" rounded p-4  border text-sm flex flex-col gap-1">
                    <div>
                      <strong>گیرنده:</strong> {selectedOrder.shipping?.shipping_address?.full_name}
                    </div>
                    <div>
                      <strong>استان:</strong> {selectedOrder.shipping?.shipping_address?.province}
                    </div>
                    <div>
                      <strong>شهر:</strong> {selectedOrder.shipping?.shipping_address?.city}
                    </div>
                    <div>
                      <strong>محله:</strong>{' '}
                      {selectedOrder.shipping?.shipping_address?.neighborhood}
                    </div>
                    <div>
                      <strong>پلاک:</strong>{' '}
                      {selectedOrder.shipping?.shipping_address?.building_number}
                    </div>
                    <div>
                      <strong>واحد:</strong> {selectedOrder.shipping?.shipping_address?.unit}
                    </div>

                    <div>
                      <strong>آدرس:</strong>{' '}
                      {selectedOrder.shipping?.shipping_address?.full_address}
                    </div>
                    <div>
                      <strong>کد پستی:</strong>{' '}
                      {selectedOrder.shipping?.shipping_address?.postal_code}
                    </div>
                  </div>

                  <div dir="rtl" className="flex flex-col gap-3 rounded p-4  border">
                    <strong>وضعیت سفارش:</strong>

                    <div className="relative w-full ">
                      <select
                        className="appearance-none w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm text-gray-700  focus:ring-2 focus:ring-[--color-main] focus:outline-none"
                        value={selectedOrder.status}
                        onChange={(e) =>
                          setSelectedOrder((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                      >
                        <option value="pending">در انتظار پرداخت</option>
                        <option value="processing">در حال پردازش</option>
                        <option value="send">ارسال شده</option>
                        <option value="delivered">تحویل داده شده</option>
                        <option value="canceled">لغو شده</option>
                      </select>
                      <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-[--color-gray] text-xs">
                        <FontAwesomeIcon
                          icon="fa-solid fa-chevron-down"
                          className="w-3 h-3 text-[--color-black] mt-[1px]"
                        />
                      </div>
                    </div>
                    <label>
                      <strong>کد رهگیری:</strong>
                      <input
                        className="border rounded p-2 w-full mt-1 "
                        value={selectedOrder.shipping?.tracking_code || ''}
                        onChange={(e) =>
                          setSelectedOrder((prev) => ({
                            ...prev,
                            shipping: {
                              ...prev.shipping,
                              tracking_code: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <button
                      onClick={handleUpdateOrderStatus}
                      className="bg-[--color-main] hover:bg-[--color-black] text-white rounded py-2 transition duration-300 mt-1"
                    >
                      ذخیره تغییرات
                    </button>
                  </div>
                </div>

                {/* تایم‌لاین تاریخچه وضعیت */}
                <div dir="rtl" className=" rounded p-6  border space-y-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-6">اطلاعات کامل سفارش</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <strong>شناسه سفارش:</strong>
                      <span>{selectedOrder._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>تاریخ ثبت:</strong>
                      <span>{new Date(selectedOrder.create_at).toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>روش پرداخت:</strong>
                      <span>{selectedOrder.payment?.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>وضعیت پرداخت:</strong>
                      <span>
                        {selectedOrder.payment?.status === 'paid' ? 'پرداخت شده' : 'پرداخت نشده'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong>شماره تراکنش:</strong>
                      <span>{selectedOrder.payment?.transaction_id || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>وضعیت سفارش:</strong>
                      <span>{orderStatusToFa(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>مبلغ کل:</strong>
                      <span className="flex gap-1">
                        {(
                          (selectedOrder.payment?.amount +
                            selectedOrder.shipping.shipping_cost -
                            selectedOrder.payment.discount_applied) /
                          10
                        ).toLocaleString()}{' '}
                        <img src={toman_icon} className="w-4 h-4" alt="" />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong>هزینه ارسال:</strong>
                      <span className="flex gap-1">
                        {(selectedOrder.shipping?.shipping_cost / 10).toLocaleString()}{' '}
                        <img src={toman_icon} className="w-4 h-4" alt="" />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong>کارمزد درگاه:</strong>
                      <span className="flex gap-1">
                        {selectedOrder.payment?.fee ? (
                          <>
                            {' '}
                            {(selectedOrder.payment?.fee / 10).toLocaleString()}{' '}
                            <img src={toman_icon} className="w-4 h-4" alt="" />{' '}
                          </>
                        ) : (
                          '-'
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong>شرکت حمل:</strong>
                      <span>{selectedOrder.shipping?.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>تحویل تقریبی:</strong>
                      <span>
                        {new Date(selectedOrder.shipping?.estimated_delivery).toLocaleDateString(
                          'fa-IR',
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <strong>کد رهگیری:</strong>
                      <span>{selectedOrder.shipping?.tracking_code || '-'}</span>
                    </div>
                    {/* یادداشت مشتری */}
                    <div className="md:col-span-2">
                      <strong className="block pb-1">یادداشت مشتری:</strong>
                      <span>{selectedOrder.customer_notes || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* محصولات */}
            <hr className="mt-6" />

            {orderProducts.length > 0 ? (
              <div className="space-y-6">
                {orderProducts.map((item, i) => (
                  <Link to={`/product/${item._id}`} className="flex-1">
                    <div dir="rtl" key={i} className="flex gap-4 border-b py-6 items-center">
                      <img
                        src={item.product?.loadedImage || no_image_img}
                        alt="محصول"
                        className="w-20 h-20 rounded object-cover border"
                      />
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="font-semibold text-gray-800">{item.product?.name}</span>
                        <span className="text-sm text-gray-500">سایز: {item.size}</span>
                        <div className="text-sm flex gap-2 items-center">
                          {item.discount ? (
                            <>
                              <span className="text-black flex gap-1 items-center">
                                {(
                                  (item.price * item.quantity - item.discount * item.quantity) /
                                  10
                                ).toLocaleString()}
                              </span>
                              <span className="line-through text-red-500 text-sm">
                                {((item.price * item.quantity) / 10).toLocaleString()}
                              </span>
                              <img src={toman_icon} className="w-4 h-4" />
                            </>
                          ) : (
                            <span className="flex gap-1 items-center text-gray-700">
                              {((item.price * item.quantity) / 10).toLocaleString()}
                              <img src={toman_icon} className="w-4 h-4" />
                            </span>
                          )}
                          <span className="text-xs text-gray-500">×{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">در حال بارگذاری اطلاعات سفارش...</p>
            )}

            {/* دکمه بستن */}
            <div className="mt-6 text-right w-full">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setOrderProducts([]);
                }}
                className="bg-[--color-main] hover:bg-[--color-black] text-[--color-white] w-full px-5 py-2 rounded transition duration-300 text-sm"
              >
                بستن
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default AdminOrders;
