import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  const admin_token = localStorage.getItem('admin_token');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: admin_token },
      });
      setUsers(res.data.body.data);
      setFilteredUsers(res.data.body.data);
    } catch (e) {
      toast.error('خطا در دریافت کاربران');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users
      .filter((u) => u.phone.includes(phoneFilter) && (roleFilter ? u.role === roleFilter : true))
      .sort((a, b) => {
        const dateA = new Date(a.create_at);
        const dateB = new Date(b.create_at);
        return sortAsc ? dateA - dateB : dateB - dateA;
      });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset page on filter change
  }, [phoneFilter, sortAsc, users, roleFilter]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-6">
      {/* فیلترها */}
      <div className="border p-5 rounded space-y-3 md:space-y-0 md:items-center  flex flex-col md:flex-row justify-between bg-white">
        <h3 className="text-lg font-semibold text-gray-800">فیلتر</h3>
        <div className="flex flex-col space-y-4 md:flex-row md:gap-3 md:space-y-0">
          {/* فیلتر شماره موبایل */}
          <div>
            <div className="relative">
              <span className="absolute top-2.5 left-3 text-gray-500 text-sm">98+</span>
              <input
                type="tel"
                placeholder="9121234567"
                value={phoneFilter}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPhoneFilter(value);
                }}
                className="border border-gray-300 rounded px-10 py-2  w-full text-left"
              />
            </div>
          </div>

          {/* فیلتر نقش */}
          <div className="relative w-full sm:w-56">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[--color-main] focus:outline-none"
            >
              <option value="">همه نقش‌ها</option>
              <option value="admin">ادمین</option>
              <option value="user">کاربر</option>
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
              onClick={() => setSortAsc((prev) => !prev)}
              className="bg-[--color-main] text-white px-4 py-2 rounded w-full md:w-52  hover:bg-[--color-black] hover:text-white"
            >
              {sortAsc ? 'مرتب‌سازی : قدیمی‌ترین' : 'مرتب‌سازی : جدید ترین'}
            </button>
          </div>
        </div>
      </div>

      {/* جدول کاربران */}
      <div className="overflow-auto rounded border">
        <table className="w-full text-sm text-center rtl text-gray-800">
          <thead className="bg-[--color-light-gray] text-xs">
            <tr>
              <th className="p-3">شناسه</th>
              <th className="p-3">نام کاربری</th>
              <th className="p-3">نام و نام خوانوادگی</th>
              <th className="p-3">شماره</th>
              <th className="p-3">نقش</th>
              <th className="p-3">ایمیل</th>
              <th className="p-3">تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  کاربری یافت نشد.
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-100">
                  <td>{user._id}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">
                    {user.firstname || user.lastname
                      ? `${user.firstname || ''} ${user.lastname || ''}`
                      : '-'}
                  </td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        user.role == 'admin'
                          ? 'bg-[--color-main] text-white'
                          : 'bg-[--color-light-gray]'
                      }`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 ltr ">{user.email || '-'}</td>
                  <td className="p-3">{new Date(user.create_at).toLocaleDateString('fa-IR')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {!loading && filteredUsers.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4 rtl">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded border transition ${
              currentPage === 1
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
                num == currentPage
                  ? 'bg-[var(--color-main)] text-[var(--color-white)]'
                  : 'border border-[var(--color-gray)] text-[var(--color-[--color-black])]'
              } w-10 h-10 rounded flex justify-center items-center`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded border transition ${
              currentPage === totalPages
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

export default UsersPage;
