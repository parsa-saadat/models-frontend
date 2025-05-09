import React from 'react';

import Title from './TitleComponent';

import { express_icon, quality_icon, support_icon } from '../../public/assets/icons/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      <div
        className="flex flex-col sm:flex-row justify-around gap-20 sm:gap-5 text-center text-xs sm:text-sm md:text-base text-[var(--color-gray)]"
        dir="rtl"
      >
        <div>
          <FontAwesomeIcon icon="truck-fast" className="text-4xl text-[var(--color-main)] mb-5" />
          <p className="font-semibold mb-2 text-[var(--color-main)]">تحویل سریع</p>
          <p>تحویل سریع و آسان با پست و تیپاکس</p>
        </div>
        <div>
          <FontAwesomeIcon
            icon="shield-heart"
            className="text-4xl text-[var(--color-main)] mb-5"
          />
          <p className="font-semibold mb-2 text-[var(--color-main)]">تضمین کیفیت</p>
          <p>تضمین کیفیت و اصالت کالا</p>
        </div>
        <div>
          <FontAwesomeIcon icon="headset" className="text-4xl text-[var(--color-main)] mb-5" />
          <p className="font-semibold mb-2 text-[var(--color-main)]">پشتیبانی فعال</p>
          <p>تیم ما همیشه آماده پاسخ به شماست</p>
        </div>
      </div>
    </div>
  );
}

export default OurPolicyComponent;
