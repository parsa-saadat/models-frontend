import React from 'react';
import { Link } from 'react-router-dom';
import { page_not_found } from '../public/assets/images/images';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-6 py-12">
      <img
        src={page_not_found}
        alt="404 illustration"
        className="w-72 h-72 mb-8"
      />
      <h1 className="text-6xl font-bold text-[--color-main] mb-4">404</h1>
      <p className="text-lg text-[--color-main] mb-6 text-center">
        متأسفیم، صفحه‌ای که دنبال می‌کنید پیدا نشد.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[--color-main] text-white rounded-xl shadow hover:bg-[--color-main] transition duration-300"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}

export default NotFoundPage;
