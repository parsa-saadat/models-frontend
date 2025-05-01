import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LogComponent from '../../components/dashboard/LogComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function LogsPage() {
  const admin_token = localStorage.getItem('admin_token');
  const limit = 30;
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/logs?limit=${limit}&page=${page}&level=${typeFilter}&desc=true`,
        { headers: { Authorization: admin_token } },
      );
      setLogs(response.data.body.data);
      const total = response.data.body.total || 0;
      setTotalPages(Math.ceil(total / limit));
    } catch (e) {
      toast.error(e?.response?.data?.message || 'خطا در دریافت لاگ‌ها');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, typeFilter]);

  return (
    <div className="flex flex-col gap-6 ">
      {/* بخش فیلتر */}
      <div className="bg-white border rounded p-5  space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">فیلتر</h3>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-56">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setPage(1);
                  setTypeFilter(e.target.value);
                }}
                className="appearance-none w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm text-gray-700 bg-white  focus:ring-2 focus:ring-[--color-main] focus:outline-none"
              >
                <option value="">همه نوع لاگ‌ها</option>
                <option value="info">اطلاعاتی</option>
                <option value="warning">هشدار</option>
                <option value="error">خطا</option>
                <option value="debug">اشکال‌زدایی</option>
                <option value="critical">بحرانی</option>
                <option value="system">سیستمی</option>
              </select>
              <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-[--color-gray] text-xs">
                <FontAwesomeIcon
                  icon="fa-solid fa-chevron-down"
                  className="w-3 h-3 text-[--color-black] mt-[1px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* لیست لاگ‌ها */}
      <div className="flex flex-col gap-3">
        {logs.length === 0 ? (
          <div className="text-center text-[--color-gray] py-10 border rounded bg-white">
            هیچ لاگی پیدا نشد.
          </div>
        ) : (
          logs.map((log) => <LogComponent key={log._id} log={log} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center flex-wrap gap-2 mt-6 text-sm font-medium">
          {/* دکمه قبلی */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`w-10 h-10 rounded border transition ${
              page === 1
                ? 'bg-gray-100 text-[--color-gray] cursor-not-allowed '
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            قبلی
          </button>

          {/* صفحات */}
          {(() => {
            const pages = [];
            const addPage = (pg) =>
              pages.push(
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-10 h-10 rounded border transition ${
                    page === pg
                      ? 'bg-[--color-main] text-white border-[--color-main]'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                  }`}
                >
                  {pg}
                </button>,
              );

            const addDots = (key) =>
              pages.push(
                <span
                  key={key}
                  className="w-10 h-10 flex items-center justify-center text-[--color-gray]"
                >
                  ...
                </span>,
              );

            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) addPage(i);
            } else {
              addPage(1);
              if (page > 4) addDots('start');

              for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) {
                addPage(i);
              }

              if (page < totalPages - 3) addDots('end');
              addPage(totalPages);
            }

            return pages;
          })()}

          {/* دکمه بعدی */}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`w-10 h-10 rounded border transition ${
              page === totalPages
                ? 'bg-gray-100 text-[--color-gray] cursor-not-allowed'
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

export default LogsPage;
