import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';
import Title from '../../components/main/TitleComponent';
import { bin_icon, toman_icon } from '../../public/assets/icons/icons';
import { no_image_img } from '../../public/assets/images/images';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CartPage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${user._id}/cart/${productId}`, {
        headers: { Authorization: `${token}` },
      });

      const updatedCart = cart.filter((item) => item.product_id !== productId);
      const updatedProducts = products.filter((product) => product._id !== productId);

      setCart(updatedCart);
      setProducts(updatedProducts);

      toast.success('محصول از سبد خرید حذف شد');
    } catch (e) {
      toast.error(e.response?.data?.message || 'خطا در حذف محصول');
    }
  };

  const loadImage = async (imageId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/storage/${imageId}`);
      return `data:${res.data.body.contentType};base64,${res.data.body.data}`;
    } catch {
      return no_image_img;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `${token}` } },
      );

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product_id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    } catch (e) {
      toast.error('خطا در به‌روزرسانی تعداد محصول');
    }
  };

  const preOrder = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/orders/pre`,
        {},
        {
          headers: { Authorization: token },
        },
      )
      .then((r) => {
        toast.success('کد برای شماره شما ارسال شد');
        navigate('/order/create');
      })
      .catch((e) => {
        if (e.response?.data?.message) {
          toast.error(e.response?.data?.message);
        } else {
          toast.error('خطا در ارسال کد');
        }
      });
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/users/${user._id}/cart`, {
          headers: { Authorization: `${token}` },
        })
        .then((r) => {
          setCart(r.data.body.data);
        })
        .catch((e) => {
          toast.error(e.response?.data?.message || 'خطا در دریافت سبد خرید');
        });
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts([]);

      const updatedProducts = await Promise.all(
        cart.map(async (item) => {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}/product/${item.product_id}`,
            );
            const productData = res.data.body;

            const imageSrc =
              productData.images?.length > 0
                ? await loadImage(productData.images[0])
                : no_image_img;

            return {
              ...productData,
              mainImage: imageSrc,
            };
          } catch (e) {
            console.error('Error loading product or image', e);
            return null;
          }
        }),
      );

      setProducts(updatedProducts.filter(Boolean));
    };

    if (cart.length > 0) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [cart]);

  useEffect(() => {
    let total = 0;
    let discount = 0;

    cart.forEach((item) => {
      const product = products.find((p) => p._id === item.product_id);
      if (product) {
        const price = product.price / 10;
        const quantity = item.quantity;
        const discountPercent = product?.discount?.percentage || 0;
        const productDiscount = (price * discountPercent) / 100;

        total += price * quantity;
        discount += productDiscount * quantity;
      }
    });

    setTotalPrice(total);
    setDiscountTotal(discount);
  }, [products, cart]);

  return (
    <div className="border-t pt-14 rtl">
      <div className="text-2xl mb-3 text-end">
        <Title partone="سبد" parttwo="خرید" />
      </div>

      <div>
        {token ? (
          products.map((product) => {
            const cartItem = cart.find((item) => item.product_id === product._id);
            const currentCart = cart.find((item) => item.product_id === product._id);

            return (
              <div
                key={product._id}
                className="py-4 border-t border-b text-[--color-gray] grid grid-cols-[0.5fr_0.5fr_4fr] sm:grid-cols-[0.5fr_2fr_4fr] items-center gap-4"
              >
                <div
                  className="flex items-start gap-6 justify-center cursor-pointer text-lg text-[--color-gray]"
                  onClick={() => removeFromCart(product._id)}
                >
                  <FontAwesomeIcon
                    className="hover:text-[--color-danger]"
                    icon="fa-solid fa-trash"
                    onClick={() => removeAddress(item._id)}
                  />
                </div>

                <div className="text-center">
                  <input
                    type="number"
                    className="w-12 border rounded text-center"
                    min={1}
                    value={cartItem?.quantity || 1}
                    onChange={(e) =>
                      updateQuantity(product._id, Math.max(1, parseInt(e.target.value)))
                    }
                  />
                </div>

                <div className="flex items-center justify-end gap-6 text-end">
                  <div className=" flex gap-1 flex-col">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-[--color-black]">سایز: {product.size}</p>
                    {product.discount?.percentage ? (
                      <span className="text-[var(--color-[--color-black])] flex gap-x-1 items-center">
                        <img src={toman_icon} className="w-4 h-4" alt="تومان" />
                        {(
                          (product.price *
                            currentCart.quantity *
                            (1 - product.discount.percentage / 100)) /
                          10
                        ).toLocaleString()}
                        <span className="mx-2 text-[var(--color-[--color-black])]">-</span>
                        <span className="line-through text-[--color-danger]">
                          {((product.price * currentCart.quantity) / 10).toLocaleString()}
                        </span>
                      </span>
                    ) : (
                      <span className="flex gap-x-1 items-center text-[--color-black]">
                        <img src={toman_icon} className="w-4 h-4" alt="تومان" />
                        {((product.price * currentCart.quantity) / 10).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.mainImage}
                      className="w-20 h-20 object-cover rounded"
                      alt={product.name}
                    />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-[--color-danger] text-end">لطفا ابتدا وارد حساب کاربری خود شوید</p>
        )}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <div className="w-full">
            <div className="text-2xl text-end">
              <Title partone="جمع سبد" parttwo="خرید" />
            </div>
            <div className="flex flex-col gap-2 mt-6 text-sm text-end">
              <div className="flex flex-row-reverse justify-between">
                <p>جمع کل</p>
                <p className="flex gap-x-1">
                  <img src={toman_icon} className="w-4 h-4" alt="تومان" />
                  {totalPrice.toLocaleString()}
                </p>
              </div>
              <hr />
              <div className="flex flex-row-reverse justify-between">
                <p>تخفیف</p>
                <p className="flex gap-x-1">
                  <img src={toman_icon} className="w-4 h-4" alt="تومان" />
                  {discountTotal.toLocaleString()}
                </p>
              </div>
              <hr />
              <div className="flex flex-row-reverse justify-between font-bold text-base">
                <p>مبلغ نهایی</p>
                <p className="flex gap-x-1">
                  <img src={toman_icon} className="w-5 h-5" alt="تومان" />
                  {(totalPrice - discountTotal).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full text-end">
            <button
              onClick={preOrder}
              className="bg-[--color-black] text-white font-semibold text-sm px-6 py-3 transition-all hover:bg-[var(--color-main)] rounded mt-6"
            >
              ادامه فرآیند خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
