import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function MediaPage() {
  const admin_token = localStorage.getItem('admin_token');
  const limit = 30;

  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [desc, setDesc] = useState(true);
  const [contentType, setContentType] = useState('');
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/storage?limit=${limit}&page=${page}${
            desc ? '&desc=true' : ''
          }${contentType ? `&contentType=${contentType}` : ''}`,
          {
            headers: {
              Authorization: admin_token,
            },
          },
        );

        setMedias(res.data.body.data);
        const totalCount = res.data.body.total || 0;
        setTotalPages(Math.ceil(totalCount / limit));
      } catch (e) {
        toast.error(e?.response?.data?.message || 'خطا در دریافت داده');
      } finally {
        setLoading(false);
      }
    };

    fetchMedias();
  }, [desc, page, contentType, reload]);

  const renderImage = (data) => {
    return `data:${data?.contentType};base64,${data?.data}`;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDeleteImage = (imageId) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/storage/${imageId}`, {
        headers: {
          Authorization: admin_token,
        },
      })
      .then(() => {
        setMedias(medias.filter((media) => media._id !== imageId));
        toast.success('تصویر با موفقیت حذف شد');
      })
      .catch((e) => {
        toast.error(e?.response?.data?.message || 'خطا در حذف تصویر');
      });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter & Upload */}
      <div className="bg-white border rounded p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">فیلتر</h3>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Select */}
            <div className="relative w-full md:w-56">
              <select
                onChange={(e) => setContentType(e.target.value)}
                className="appearance-none w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[--color-main] focus:outline-none"
              >
                <option value="">همه رسانه ها</option>
                <option value="image/jpeg">JPEG - جی پگ</option>
                <option value="image/jpg">JPG - جی پی جی</option>
                <option value="image/png">PNG - پی ان جی</option>
                <option value="image/gif">GIF - جی ای فی</option>
                <option value="image/webp">WEBP - ویب پی</option>
                <option value="video/mp4">MP4 - ام پی فور</option>
                <option value="video/webm">WEBM - ویب ام</option>
                <option value="video/ogg">OGG - او جی</option>
              </select>
              <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-[--color-gray] text-xs">
                <FontAwesomeIcon
                  icon="fa-solid fa-chevron-down"
                  className="w-3 h-3 text-[--color-black] mt-[1px]"
                />
              </div>
            </div>
            {/* Sort Button */}
            <button
              onClick={() => setDesc(!desc)}
              className="bg-[--color-main] text-white px-4 py-2 rounded w-full md:w-52 hover:bg-[--color-black]"
            >
              {desc ? 'مرتب‌سازی : قدیمی‌ترین' : 'مرتب‌سازی : جدیدترین'}
            </button>
            {/* File Upload */}
            <input
              type="file"
              id="upload-input"
              accept="image/*,video/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('files', file);

                try {
                  await axios.post(`${import.meta.env.VITE_API_URL}/storage`, formData, {
                    headers: {
                      Authorization: admin_token,
                      'Content-Type': 'multipart/form-data',
                    },
                  });
                  toast.success('فایل با موفقیت آپلود شد');
                  setReload((prev) => prev + 1);
                  setPage(1);
                } catch (e) {
                  toast.error('خطا در آپلود فایل');
                }
              }}
            />
            <label
              htmlFor="upload-input"
              className="py-2 px-[14px] cursor-pointer flex items-center justify-center text-sm font-medium tracking-wide text-white bg-[--color-main] rounded hover:bg-[--color-black]"
            >
              <FontAwesomeIcon icon="fa-solid fa-add" />
            </label>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mt-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">در حال بارگذاری...</div>
        ) : (
          medias.map((media) => (
            <div
              key={media._id}
              className="relative group rounded overflow-hidden border border-gray-200 bg-white flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                {media.contentType.startsWith('video') ? (
                  <video
                    src={renderImage(media)}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={renderImage(media)}
                    alt={media.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-[black]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                  <div className="absolute top-2 right-2 z-10">
                    <FontAwesomeIcon
                      onClick={() => {
                        handleDeleteImage(media._id);
                      }}
                      icon="trash"
                      className="text-base hover:text-[--color-danger] cursor-pointer"
                    />
                  </div>
                  <FontAwesomeIcon
                    onClick={() => {
                      navigator.clipboard.writeText(media._id);
                      toast.success('آی‌دی کپی شد!');
                    }}
                    icon="fa-solid fa-copy"
                    className="text-3xl hover:text-[--color-main] p-12"
                  />
                </div>
              </div>
              <div className="p-3 text-sm text-gray-700 space-y-1">
                <div className="font-semibold truncate" title={media.name}>
                  {media.name}
                </div>
                <div>سایز: {(media.size / 1024 / 1024).toFixed(3)} MB</div>
                <div className="text-xs text-gray-500">
                  {new Date(media.create_at).toLocaleDateString('fa-IR')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="flex justify-center items-center gap-2 mt-4 rtl">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`w-10 h-10 rounded border ${
              page === 1
                ? 'bg-gray-100 text-[--color-gray] cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            قبلی
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`w-10 h-10 rounded flex justify-center items-center ${
                num === page
                  ? 'bg-[var(--color-main)] text-white'
                  : 'border border-[var(--color-gray)] text-[--color-black]'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`w-10 h-10 rounded border ${
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

export default MediaPage;
