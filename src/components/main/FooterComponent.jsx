import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTelegram } from '@fortawesome/free-brands-svg-icons';

function FooterComponent() {
  const { settings } = useSettings();

  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[1fr_1fr_3fr] gap-14 my-10 mt-40 text-sm">
        {/* بخش ارتباط با ما */}
        <div className="flex flex-col items-end">
          <p className="text-lg mb-3">ارتباط با ما</p>
          <ul className="flex flex-col gap-2 text-gray-600 items-end">
            <li className="flex gap-2">
              <span>{settings?.contact_phone}</span>
              <FontAwesomeIcon icon="phone-flip" className="text-base text-[--color-main]" />
            </li>
            <li className="flex gap-2">
              <span>{settings?.contact_email}</span>
              <FontAwesomeIcon icon="envelope" className="text-base text-[--color-main]" />
            </li>
            <li className="flex gap-2">
              <span>{settings?.telegram_chanel}</span>
              <FontAwesomeIcon icon={faTelegram} className="text-base text-[--color-main]" />
            </li>
            <li className="flex gap-2">
              <span>{settings?.instagram_page}</span>
              <FontAwesomeIcon icon={faInstagram} className="text-base text-[--color-main]" />
            </li>
            <li className="flex gap-2">
              <span>{settings?.telegram_support}</span>
              <FontAwesomeIcon icon="user" className="text-base text-[--color-main]" />
            </li>
          </ul>
        </div>

        {/* بخش صفحات */}
        <div className="flex flex-col items-end">
          <p className="text-lg mb-3">صفحات</p>
          <ul className="flex flex-col gap-2 text-gray-600 items-end">
            <Link to="/">
              <li>خانه</li>
            </Link>
            <Link to="/shop">
              <li>فروشگاه</li>
            </Link>
            <Link to="/about">
              <li>درباره ما</li>
            </Link>
            <Link to="/contact">
              <li>تماس با ما</li>
            </Link>
          </ul>
        </div>

        {/* بخش لوگو و توضیحات */}
        <div className="flex flex-col items-end">
          <img src={settings?.logo} alt="Logo" className="mb-5 mr-[-14px] h-10 w-36 object-cover" />
          <p className="w-full md:w-2/3 text-[var(--color-gray)] text-end">
            ما با استفاده از تکنولوژی های پیشرفته و با بهره گیری از متخصصان مجرب سعی داریم بهترین
            محصولات را برای شما عزیزان ارائه دهیم. ما با استفاده از تکنولوژی های پیشرفته و با بهره
            گیری از متخصصان مجرب.
          </p>
        </div>
      </div>

      {/* خط جداساز و کپی رایت */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          تمامی حقوق این وب‌سایت متعلق به {settings?.site_name} است. © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default FooterComponent;
