import React from 'react';
import Title from './TitleComponent';

function WhyChoseUsComponent() {
  return (
    <div className="flex flex-col justify-center items-center my-auto">
      <div class=" text-3xl py-6 mt-20">
        <Title partone="چرا" parttwo="ما" />
        <p className="m-auto text-xs sm:text-sm md:text-base text-[var(--color-gray)]">
          چرا ما را انتخاب کنید؟
        </p>
      </div>
      <div class="flex flex-col md:flex-row text-sm ">
        <div class="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-l">
          <b className="text-end">کیفت و سلامت</b>
          <p className=" text-gray-600 text-end">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
          </p>
        </div>
        <div class="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b className="text-end">کیفت و سلامت</b>
          <p className=" text-gray-600 text-end">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
          </p>
        </div>
        <div class="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-r">
          <b className="text-end">کیفت و سلامت</b>
          <p className=" text-gray-600 text-end">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhyChoseUsComponent;
