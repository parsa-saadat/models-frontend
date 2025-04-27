import React from 'react';

import Title from './TitleComponent';

import { express_icon, quality_icon, support_icon } from '../../public/assets/icons/icons';

function OurPolicyComponent() {
  return (
    <div className="flex flex-col items-stretch justify-center mt-20">
      <div>
        <div className="text-center py-8 text-3xl">
          <Title partone="چرا " parttwo="ما" />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[var(--color-gray)]">
            چرا بهتره از ما خرید کنید
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-around gap-13 sm:gap-2 text-center gap-20 text-xs sm:text-sm md:text-base text-[var(--color-gray)] ">
        <div>
          <img src={express_icon} className="w-12 m-auto mb-5" alt="" />
          <p className="font-semibold mb-2 text-[var(--color-main)]">تحویل سریع</p>
          <p className="text-[var(--color-gray)]">تحویل سریع و آسان با پست و تیپاکس</p>
        </div>
        <div>
          <img src={quality_icon} className="w-12 m-auto mb-5" alt="" />
          <p className="font-semibold mb-2 text-[var(--color-main)]">تصمین کیفت</p>
          <p className="text-[var(--color-gray)]">تضمین کیفیت و اصالت کالا</p>
        </div>
        <div>
          <img src={support_icon} className="w-12 m-auto mb-5" alt="" />
          <p className="font-semibold mb-2 text-[var(--color-main)]">پشتبیبانی فعال</p>
          <p className="text-[var(--color-gray)]">تیم ما همیشه آماده پاسخ به شماست</p>
        </div>
      </div>
    </div>
  );
}

export default OurPolicyComponent;
