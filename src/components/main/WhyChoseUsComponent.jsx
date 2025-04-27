import React from 'react';
import Title from './TitleComponent';

function WhyChoseUsComponent() {
  return (
    <div className="flex flex-col justify-center items-center my-auto">
      <div className="text-3xl py-6 mt-20">
        <Title partone="چرا" parttwo="ما" />
        <p className="m-auto text-xs sm:text-sm md:text-base text-[var(--color-gray)]">
          چرا ما را انتخاب کنید؟
        </p>
      </div>
      <div className="flex flex-col md:flex-row text-sm">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-l">
          <b className="text-end">تنوع بی‌نظیر محصولات</b>
          <p className="text-gray-600 text-end">
            ارائه مجموعه‌ای خاص از مدل‌های کلکسیونی در مقیاس‌های مختلف، برای سلیقه‌های گوناگون.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-end">تضمین کیفیت و اصالت</b>
          <p className="text-gray-600 text-end">
            تمامی کالاها اصل بوده و با دقت فراوان بررسی و انتخاب شده‌اند تا بهترین تجربه به شما ارائه شود.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-r">
          <b className="text-end">پشتیبانی و مشاوره حرفه‌ای</b>
          <p className="text-gray-600 text-end">
            در هر مرحله از خرید، تیم پشتیبانی ما آماده پاسخگویی و مشاوره به شماست.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhyChoseUsComponent;
