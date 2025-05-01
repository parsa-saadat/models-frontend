import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import LogComponent from '../../components/dashboard/LogComponent';

function CounterPage() {
  const admin = JSON.parse(localStorage.getItem('admin'));
  const admin_token = localStorage.getItem('admin_token');

  const [isServerUp, setIsServerUp] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [openOrdersCount, setOpenOrdersCount] = useState(0);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/product?limit=1`);
        setIsServerUp(true);
      } catch (error) {
        setIsServerUp(false);
      }
    };

    const fetchRecentLogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/logs?limit=50&desc=true`,
          { headers: { Authorization: admin_token } },
        );
        setRecentLogs(response.data.body.data);
      } catch (error) {
        toast.error('Error fetching recent logs:', error);
      }
    };

    const fetchOpenOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders?pay_status=paid&status=processing&limit=100`,
          { headers: { Authorization: admin_token } },
        );
        setOpenOrders(res.data.body.data);
        setOpenOrdersCount(res.data.body.total);
      } catch (e) {
        toast.error(e.response.data.message);
      }
    };

    const fetchUsersCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users?limit=1`, {
          headers: { Authorization: admin_token },
        });
        setUsersCount(res.data.body.total);
      } catch (e) {
        toast.error(e.response.data.message);
      }
    };

    const fetchOrdersCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders?limit=1`, {
          headers: { Authorization: admin_token },
        });
        setOrdersCount(res.data.body.total);
      } catch (e) {
        toast.error(e.response.data.message);
      }
    };

    const fetchProductsCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/product?limit=1`, {
          headers: { Authorization: admin_token },
        });
        setProductsCount(res.data.body.total);
      } catch (e) {
        toast.error(e.response.data.message);
      }
    };

    checkServer();
    fetchOrdersCount();
    fetchProductsCount();
    fetchUsersCount();
    fetchOpenOrders();
    fetchRecentLogs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Server Status */}
      <div className="bg-[--color-light-gray] p-4 rounded flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2">
        {isServerUp === null ? (
          <span className="text-[--color-warning] animate-pulse font-semibold">
            در حال بررسی وضعیت سرور...
          </span>
        ) : isServerUp ? (
          <>
            <FontAwesomeIcon icon={faCircleCheck} className="text-[--color-main] text-lg" />
            <span className="text-[--color-main] font-bold">سرور فعال است</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCircleExclamation} className="text-[--color-danger] text-lg" />
            <span className="text-[--color-danger] font-bold">سرور در دسترس نیست</span>
          </>
        )}
      </div>

      {/* Counter Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'مجموع سفارشات', value: ordersCount },
          { title: 'سفارشات باز', value: openOrdersCount },
          { title: 'مجموع کاربران', value: usersCount },
          { title: 'محصولات', value: productsCount },
        ].map((item, index) => (
          <div key={index} className="bg-white p-4 rounded flex flex-col gap-2 text-center">
            <h3 className="text-[--color-main] font-bold text-sm">{item.title}</h3>
            <span className="text-2xl font-bold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Extra Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Logs */}
        <div className="bg-white p-4 rounded space-y-4">
          <h4 className="text-[--color-main] font-bold text-base border-b pb-2">لاگ های اخیر</h4>
          <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
            {recentLogs.map((log) => (
              <LogComponent log={log} />
            ))}
          </div>
        </div>

        {/* Open Orders */}
        <div className="bg-white p-4 rounded space-y-4">
          <h4 className="text-[--color-main] font-bold text-base border-b pb-2">سفارش های باز</h4>
          <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
            {openOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-gray-100 rounded p-3 hover:bg-[--color-light-gray] transition"
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon="fa-solid fa-box" className="text-[--color-main] text-sm" />
                  <span className="text-sm text-gray-800">{order._id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CounterPage;
