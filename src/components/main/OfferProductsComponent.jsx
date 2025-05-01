import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Title from './TitleComponent';
import Product from './ProductComponent';

function OfferProductsComponent() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/product?discount=true&limit=6&stock_status=IN STOCK`)
      .then((res) => setProducts(res.data.body.data));
  }, []);

  return (
    <div className="mb-10 mt-30">
      <div className="text-center py-8 text-3xl">
        <Title partone="همراه با" parttwo="تخفیف" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[var(--color-gray)]">
          محصولات تخفیف دار ما
        </p>
      </div>
      {products == 0 ? (
        <div className="text-center mt-5">
          <p className="text-gray-500 mt-2">محصولی پیدا نشد</p>
        </div>
      ) : (
        <div dir='rtl' className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 gap-y-6">
          {products.map((product) => (
            <Product product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OfferProductsComponent;
