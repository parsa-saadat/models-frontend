import React from 'react';
import { about_img } from '../../public/assets/images/images';
import Title from './TitleComponent';

function AboutUsComponent() {
  return (
    <div className="flex flex-col justify-center items-center my-auto">
      <div class="text-3xl text-center pt-8 border-t">
        <Title partone="درباره" parttwo="ما" />
      </div>
      <div class="my-10 flex flex-col lg:flex-row gap-16 items-center justify-center">
        <img class="h-[400px] md:max-w-[450px] object-cover rounded" src={about_img} alt="" />
        <div class="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <b class="text-gray-800 text-end">یوتوپیا</b>
          <p className="text-end">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک
            است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط
            فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد،
            کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می
            طلبد، تا با نرم افزارها شناخت بیشتری را برای
          </p>
          <b class="text-gray-800 text-end">هدف ما</b>
          <p className="text-end">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک
            است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط
            فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد،
            کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می
            طلبد، تا با نرم افزارها شناخت بیشتری را برای
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUsComponent;
