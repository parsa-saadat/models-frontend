import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function SettingPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});

  const admin_token = localStorage.getItem('admin_token');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/setting`, {
          headers: { Authorization: admin_token },
        });
        setSettings(res.data.body);
        setOriginalSettings(res.data.body);
        setLoading(false);
      } catch (err) {
        toast.error('خطا در دریافت تنظیمات');
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/settings/`, settings, {
        headers: { Authorization: admin_token },
      });
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (err) {
      toast.error('خطا در ذخیره تنظیمات');
    }
  };

  if (loading) return <div className="text-center p-10">در حال بارگذاری...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Builder */}
        {[
          { label: 'نام سایت', name: 'site_name' },
          { label: 'آیدی لوگو', name: 'logo_image_id' },
          { label: 'آیدی فاوآیکون', name: 'favicon_image_id' },
          { label: 'آیدی بنر', name: 'banner_image_id' },
          { label: 'ایمیل تماس', name: 'contact_email' },
          { label: 'تلفن تماس', name: 'contact_phone' },
          { label: 'رنگ قالب (HEX)', name: 'theme_color' },
          { label: 'کانال تلگرام', name: 'telegram_chanel' },
          { label: 'پشتیبانی تلگرام', name: 'telegram_support' },
          { label: 'صفحه اینستاگرام', name: 'instagram_page' },
        ].map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label className="text-gray-700 font-semibold">{field.label}</label>
            <input
              name={field.name}
              value={settings[field.name] || ''}
              onChange={handleChange}
              placeholder={originalSettings[field.name] || `مقدار وارد کنید`}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[--color-main] transition"
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSave}
          className="bg-[--color-main] hover:bg-[--color-black] text-white px-10 py-3 rounded text-sm transition"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}

export default SettingPage;
