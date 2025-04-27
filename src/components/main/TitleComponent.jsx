import React from 'react';

function Title({ partone, parttwo }) {
  return (
    <div className="inline-flex gap-2 items-center">
      <p className="w-8 md:w-9 h-[2px] bg-[var(--color-gray)]"></p>

      <p className="text-[--color-black]">
        {partone} <span className="text-[var(--color-main)] font-medium">{parttwo}</span>
      </p>
    </div>
  );
}

export default Title;
