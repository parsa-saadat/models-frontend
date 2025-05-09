import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function SettingPage() {
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});

  const admin_token = localStorage.getItem('admin_token');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/setting`, {
          headers: { Authorization: admin_token },
        });
        setSettings(res.data.body);
        setOriginalSettings(res.data.body);
      } catch (err) {
        toast.error('خطا در دریافت تنظیمات');
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
      location.reload()
    } catch (err) {
      toast.error('خطا در ذخیره تنظیمات');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* نام سایت */}
        <div className="flex flex-col gap-2 col-span-2">
          <label className="text-gray-700 font-semibold">نام سایت</label>
          <input
            name="site_name"
            value={settings?.site_name || ''}
            onChange={handleChange}
            placeholder={originalSettings?.site_name || 'مقدار وارد کنید'}
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* آیدی لوگو */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">آیدی لوگو</label>
          <input
            name="logo_image_id"
            value={settings?.logo_image_id || ''}
            onChange={handleChange}
            placeholder={originalSettings?.logo_image_id || 'مقدار وارد کنید'}
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* آیدی فاوآیکون */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">آیدی فاوآیکون</label>
          <input
            name="favicon_image_id"
            value={settings?.favicon_image_id || ''}
            onChange={handleChange}
            placeholder={originalSettings?.favicon_image_id || 'مقدار وارد کنید'}
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* ایمیل تماس */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">ایمیل تماس</label>
          <input
            name="contact_email"
            value={settings?.contact_email || ''}
            onChange={handleChange}
            placeholder={originalSettings?.contact_email || 'مقدار وارد کنید'}
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* تلفن تماس */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">تلفن تماس</label>
          <input
            name="contact_phone"
            value={settings?.contact_phone || ''}
            onChange={handleChange}
            placeholder={originalSettings?.contact_phone || 'مقدار وارد کنید'}
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* رنگ قالب (HEX) */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <label
              htmlFor="theme_color"
              className="block mb-2 text-md font-medium text-[--color-black]"
            >
              رنگ
            </label>

            <div className="flex items-center">
              {/* Circle Color Preview */}
              <div
                onClick={() => document.getElementById('theme_color').click()}
                className="w-10 h-10 rounded border border-[--color-gray] cursor-pointer transition-all duration-200  px-4 ml-2"
                style={{
                  backgroundColor: settings?.theme_color || '#191919',
                }}
              ></div>

              {/* Hidden Color Input */}
              <input
                type="color"
                name="theme_color"
                id='theme_color'
                value={settings?.theme_color || ''}
                onChange={handleChange}
                placeholder={originalSettings?.theme_color || 'مقدار وارد کنید'}
                className="absolute w-0 h-0 opacity-0"
                />

              {/* Text Input for Hex Code */}
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full"
                name="theme_color"
                value={settings?.theme_color || ''}
                onChange={handleChange}
                placeholder={originalSettings?.theme_color || 'مقدار وارد کنید'}
              />
            </div>
          </div>
        </div>

        {/* کانال تلگرام */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">کانال تلگرام</label>
          <input
            name="telegram_chanel"
            value={settings?.telegram_chanel || ''}
            onChange={handleChange}
            placeholder={originalSettings?.telegram_chanel || 'مقدار وارد کنید'}
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* پشتیبانی تلگرام */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">پشتیبانی تلگرام</label>
          <input
            name="telegram_support"
            value={settings?.telegram_support || ''}
            onChange={handleChange}
            placeholder={originalSettings?.telegram_support || 'مقدار وارد کنید'}
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* صفحه اینستاگرام */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">صفحه اینستاگرام</label>
          <input
            name="instagram_page"
            value={settings?.instagram_page || ''}
            onChange={handleChange}
            placeholder={originalSettings?.instagram_page || 'مقدار وارد کنید'}
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSave}
          className="bg-[--color-main] hover:bg-[--color-black] text-white px-10 py-3 rounded text-sm"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}

export default SettingPage;
