import React from 'react';
import { contact_img } from '../../public/assets/images/images';
import { useSettings } from '../../contexts/SettingsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faInstagram } from '@fortawesome/free-brands-svg-icons';

function ContactPage() {
  const { settings } = useSettings();

  return (
    <div dir="rtl" className="px-4">
      <div className="my-10 flex flex-col justify-center md:flex-row gap-16 mb-28 items-center">
        <img className="w-full md:max-w-[500px] rounded shadow-md" src={contact_img} alt="تماس با ما" />
        <div className="flex flex-col justify-center items-start gap-8 text-end w-full md:max-w-[500px]">
          <div>
            <p className="font-bold text-2xl text-gray-700 mb-2 text-start">ارتباط با ما</p>
            <p className="text-gray-500 text-sm">
              برای هرگونه سوال، سفارش یا همکاری خوشحال می‌شویم با ما در تماس باشید:
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full items-start">
            {settings?.contact_email && (
              <div className="flex items-center justify-end gap-3 text-gray-500 hover:text-[var(--color-main)] transition-colors">
                <FontAwesomeIcon icon="envelope" className="text-lg" />
                <span className="text-sm">{settings.contact_email}</span>
              </div>
            )}
            {settings?.contact_phone && (
              <div className="flex items-center justify-end gap-3 text-gray-500 hover:text-[var(--color-main)] transition-colors">
                <FontAwesomeIcon icon="phone-flip" className="text-lg" />
                <span className="text-sm">{settings.contact_phone}</span>
              </div>
            )}
            {settings?.telegram_support && (
              <div className="flex items-center justify-end gap-3 text-gray-500 hover:text-[var(--color-main)] transition-colors">
                <FontAwesomeIcon icon="user" className="text-lg" />
                <span className="text-sm">{settings.telegram_support}</span>
              </div>
            )}
            {settings?.telegram_chanel && (
              <div className="flex items-center justify-end gap-3 text-gray-500 hover:text-[var(--color-main)] transition-colors">
                <FontAwesomeIcon icon={faTelegram} className="text-lg" />
                <span className="text-sm">{settings.telegram_chanel}</span>
              </div>
            )}
            {settings?.instagram_page && (
              <div className="flex items-center justify-end gap-3 text-gray-500 hover:text-[var(--color-main)] transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="text-lg" />
                <span className="text-sm">{settings.instagram_page}</span>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-sm mt-6 text-start">
            همچنین می‌توانید از طریق فرم تماس سایت، پیام خود را برای ما ارسال کنید. تیم پشتیبانی در سریع‌ترین زمان پاسخگو خواهد بود.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
