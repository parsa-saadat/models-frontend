import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MediaSelector = ({ onSelect }) => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/storage`);
      const rawFiles = res.data.body.data;

      const preparedFiles = rawFiles.map((file) => {
        const binary = atob(file.data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: file.contentType });
        const url = URL.createObjectURL(blob);
        return { ...file, url };
      });

      setFiles(preparedFiles);
    } catch (err) {
      console.error('خطا در گرفتن فایل‌ها:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (file) => {
    const alreadySelected = selectedFiles.find((f) => f._id === file._id);
    let newSelected;
    if (alreadySelected) {
      newSelected = selectedFiles.filter((f) => f._id !== file._id);
    } else {
      newSelected = [...selectedFiles, file];
    }
    setSelectedFiles(newSelected);
    onSelect && onSelect(newSelected);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-white shadow rounded max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">کتابخانه رسانه</h2>

      <input
        type="text"
        placeholder="جستجو بر اساس نام فایل..."
        className="mb-4 w-full p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {filteredFiles.map((file) => {
            const isSelected = selectedFiles.some((f) => f._id === file._id);
            return (
              <div
                key={file._id}
                onClick={() => toggleSelect(file)}
                className={`cursor-pointer border-2 p-1 rounded relative overflow-hidden ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent'
                } hover:border-blue-400 transition-all`}
              >
                {file.contentType.startsWith('image') ? (
                  <img src={file.url} alt={file.name} className="w-full h-24 object-cover rounded" />
                ) : file.contentType.startsWith('video') ? (
                  <video
                    src={file.url}
                    className="w-full h-24 object-cover rounded"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="text-center text-xs">فایل: {file.name}</div>
                )}
                {isSelected && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    انتخاب شده
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">فایل‌های انتخاب شده:</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            {selectedFiles.map((file) => (
              <li key={file._id} className="border p-2 rounded bg-gray-50">
                <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB) -{' '}
                {file.contentType}
              </li>
            ))}
          </ul>

          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => onSelect && onSelect(selectedFiles)}
          >
            تایید انتخاب
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaSelector;
