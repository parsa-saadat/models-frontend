import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

function ProductsPage() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [desc, setDesc] = useState(true);
  const [reload, serReload] = useState(0);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border rounded p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">فیلتر</h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Select */}
            <div>
              <div className="relative border border-gray-300 rounded px-2 py-2 flex items-center justify-center outline-none">
                <input
                  placeholder="جستجو..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  className="text-right pr-9 px-2 w-full h-full outline-none"
                />
                {/* search button */}
                <div
                  onClick={() => setReload(reload + 1)}
                  className="absolute right-0 h-full flex items-center justify-center p-3 bg-[--color-main] rounded-r text-white cursor-pointer"
                >
                  <FontAwesomeIcon icon="search" />
                </div>
              </div>
            </div>
            {/* Sort Button */}
            <button
              onClick={() => setDesc(!desc)}
              className="bg-[--color-main] text-white px-4 py-2 rounded w-full md:w-52 hover:bg-[--color-black]"
            >
              {desc ? 'مرتب‌سازی : قدیمی‌ترین' : 'مرتب‌سازی : جدیدترین'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
