import React from 'react';
import { header_img } from '../../public/assets/images/images';
import { useNavigate } from 'react-router-dom';

const HeaderComponnet = () => {
  const navigate = useNavigate()
  return (
    <div className=" flex flex-col sm:flex-row border border-[var(--color-gray)] rounded">
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[var(--color-dark-gray)]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[var(--color-gray)]"></p>
            <p className="font-medium text-sm md:text-base">کمیاب ترین ها را با ما داشته باشید</p>
          </div>
          <h1 className="text-3xl text-bold uppercase sm:py-3 lg:text-5xl leading-relaxed">
          FERRARI 296 GTB
          </h1>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/shop')}>
            <p className="font-semibold text-sm md:text-base hover:text-[--color-main]">رفتن به فروشگاه</p>
            <p className="w-8 md:w-11 h-[2px] bg-[var(--color-gray)]"></p>
          </div>
        </div>
      </div>

      <img className="w-full sm:w-1/2 object-cover min-h-[140px] xl:min-h-[560px]" src={header_img} />
    </div>
  );
};

export default HeaderComponnet;
