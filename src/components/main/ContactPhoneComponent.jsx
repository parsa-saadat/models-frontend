import React from 'react';
import Title from './TitleComponent';

function ContactPhoneComponent() {
  const onSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center mt-20">
      <div className="text-center py-3 text-3xl">
        <Title partone="تماس با" parttwo="ما" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[var(--color-gray)]">
          آماده خریداری مدل های شما
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="rounded w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          className="w-full sm:flex-1 outline-none text-end"
          type="phone"
          placeholder="شماره خود را وارد کنید"
          required=""
        />
        <button
          type="submit"
          className="bg-[--color-black] text-white font-semibold text-sm px-10 py-4 transition-all hover:bg-[var(--color-main)] rounded-r"
        >
          ارسال
        </button>
      </form>
    </div>
  );
}

export default ContactPhoneComponent;
