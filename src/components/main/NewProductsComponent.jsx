import React, { useEffect, useState } from 'react';

import Title from './TitleComponent';
import Product from './ProductComponent';

import axios from 'axios';

function NewProductsComponent() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/product?limit=6&desc=true`)
      .then((res) => setProducts(res.data.body.data));
  }, []);

  return (
    <div className="mb-10 mt-20">
      <div className="text-center py-8 text-3xl">
        <Title partone="جدید ترین" parttwo="محصولات" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[var(--color-gray)]">
          بروز ترین ها را با ما داشته باشید
        </p>
      </div>
      {products == 0 ? (
        <div className="text-center mt-5">
          <p className="text-gray-500 mt-2">محصولی پیدا نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 gap-y-6">
          {products.map((product) => (
            <Product product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NewProductsComponent;
