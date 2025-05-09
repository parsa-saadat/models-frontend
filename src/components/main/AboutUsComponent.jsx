import React from 'react';
import { about_img } from '../../public/assets/images/images';
import Title from './TitleComponent';
import { useSettings } from '../../contexts/SettingsContext';

function AboutUsComponent() {
  const { settings } = useSettings();

  return (
    <div className="flex flex-col justify-center items-center my-auto">
      <div className="text-3xl text-center pt-8 border-t">
        <Title partone="درباره" parttwo="ما" />
      </div>
      <div className="my-10 flex flex-col lg:flex-row gap-16 items-center justify-center">
        <img className="h-[400px] md:max-w-[450px] object-cover rounded" src={about_img} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <b className="text-gray-800 text-end">فروشگاه ما</b>
          <p dir='rtl' className="text-start">
            ما در {settings?.site_name} با عشق به دنیای مدل‌های کلکسیونی فعالیت می‌کنیم. هدف ما ارائه محصولات خاص و کمیاب در مقیاس‌های 1/64، 1/18، 1/8 و غیره است تا هر کلکسیونر بتواند با خیال راحت خرید کند و مجموعه‌اش را کامل کند.
          </p>
          <b className="text-gray-800 text-end">هدف ما</b>
          <p className="text-end">
            تمرکز ما بر اصالت کالا، کیفیت بالا و ارائه تجربه‌ای لذت‌بخش برای مشتریان است. تیم ما همیشه در تلاش است تا با فراهم کردن مدل‌های خاص و پشتیبانی حرفه‌ای، بهترین همراه شما در مسیر ساخت کلکسیون رویاهایتان باشد.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUsComponent;
