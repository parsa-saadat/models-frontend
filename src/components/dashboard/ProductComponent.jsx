import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { no_image_img } from '../../public/assets/images/images';

function DashboardProductComponent({ product }) {
  const [image, setImage] = useState();

  useEffect(() => {
    if (product.images.length > 0)
      axios
        .get(`${import.meta.env.VITE_API_URL}/storage/${product.images[0]}`)
        .then((res) => {
          setImage(`data:${res.data.body.contentType};base64,${res.data.body.data}`);
        })
        .catch((err) => setImage(no_image_img));

    image ?? setImage(no_image_img);
  });

  return (
    <Link to={`/dashboard/products/${product._id}`}>
      <div className={`flex flex-col items-end rounded`} key={product._id}>
        <div className="relative aspect-square w-full overflow-hidden">
          <img className="absolute top-0 left-0 w-full h-full object-cover rounded" src={image} />
        </div>
        <p className="font-bold text-xs bg-[var(--color-white)] w-min p-1 rounded text-[var(--color-dark-gray)] absolute m-2">
          {product.size}
        </p>
        <div className="flex justify-between items-left w-full">
          <div className="flex flex-col items-start w-1/3">
            <p className="font-bold text-xs w-min rounded-2xl text-[var(--color-dark-gray)] pt-3">
              {product.production}
            </p>
          </div>
          <div className="flex flex-col items-end w-2/3">
            <p className="pt-3 pb-1 text-sm">
              {product.name} <span className='text-xs'>x{product.quantity}</span>
            </p>

            {product.stock_status === 'IN STOCK' ? (
              <>
                {product.discount.percentage ? (
                  <p className="text-sm font-medium text-[var(--color-[--color-black])] flex items-center">
                    {Math.floor(
                      (product.price / 10) * (1 - product.discount.percentage / 100),
                    ).toLocaleString()}

                    <span className="font-bold text-[var(--color-[--color-black])] mx-2">-</span>
                    <span className="text-[var(--color-danger)] line-through">
                      {(product.price / 10).toLocaleString()}
                    </span>

                    <span className="text-[var(--color-[--color-black])] pl-1">تومان</span>
                  </p>
                ) : (
                  <p className="text-sm font-medium flex items-center">
                    {(product.price / 10).toLocaleString()}
                    <span className="text-[var(--color-[--color-black])] pl-1">تومان</span>
                  </p>
                )}
              </>
            ) : (
              <span className="text-[var(--color-danger)] pl-1 text-xs font-bold">ناموجود</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
export default DashboardProductComponent;
