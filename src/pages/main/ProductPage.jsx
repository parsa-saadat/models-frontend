import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import markdown from '@wcj/markdown-to-html';
import { toast } from 'react-toastify';

import { no_image_img } from '../../public/assets/images/images';
import { toman_icon } from '../../public/assets/icons/icons';

import NewProductsComponent from '../../components/main/NewProductsComponent';
import ShareButtons from '../../components/main/ShareButtonsComponent';

function ProductPage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();
  const { productId } = useParams();

  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(no_image_img);
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [inCart, setInCart] = useState(false);

  const stockStatusToFarsi = () => {
    switch (product.stock_status) {
      case 'IN STOCK':
        return 'موجود';
      case 'OUT OF STOCK':
        return 'ناموجود';
      case 'COMING SOON':
        return 'به زودی';
      default:
        return 'نامشخص';
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/product/${productId}`);
      const data = res.data.body;

      data.create_at = new Date(data.create_at).toLocaleDateString('fa-IR');
      data.description = markdown(data.description);

      const basePrice = data.price / 10;
      const discount = data.discount?.percentage;

      setPrice(basePrice.toLocaleString());
      if (discount) {
        const discounted = Math.floor(basePrice * (1 - discount / 100));
        setDiscountPrice(discounted.toLocaleString());
      } else {
        setDiscountPrice('');
      }

      setProduct(data);
      loadImages(data.images || []);
    } catch (err) {
      toast.error('خطا در دریافت اطلاعات محصول');
    }
  };

  const loadImages = async (imageIds) => {
    if (!imageIds.length) {
      setImages([no_image_img]);
      setMainImage(no_image_img);
      return;
    }

    try {
      const resArr = await Promise.all(
        imageIds.map((id) => axios.get(`${import.meta.env.VITE_API_URL}/storage/${id}`)),
      );

      const loaded = resArr.map(
        (res) => `data:${res.data.body.contentType};base64,${res.data.body.data}`,
      );

      setImages(loaded);
      setMainImage(loaded[0]);
    } catch {
      setImages([no_image_img]);
      setMainImage(no_image_img);
    }
  };

  const checkCartStatus = async () => {
    if (!token) return;

    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/users/${user._id}/cart/${productId}`, {
        headers: { Authorization: token },
      });
      setInCart(true);
    } catch {
      setInCart(false);
    }
  };

  const addToCart = async () => {
    if (!token) return navigate('/login');

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/cart/`,
        {
          product_id: productId,
          quantity: 1,
        },
        {
          headers: { Authorization: token },
        },
      );

      toast.success('محصول به سبد خرید اضافه شد');
      setInCart(true);
    } catch (e) {
      if (e.response?.data?.message === 'Product already exists in cart') {
        toast.warn('محصول در سبد خرید موجود است');
      } else {
        toast.error('خطا در افزودن محصول به سبد خرید');
      }
    }
  };

  const removeFromCart = async () => {
    if (!token) return navigate('/login');

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${user._id}/cart/${productId}`, {
        headers: { Authorization: token },
      });

      toast.success('محصول از سبد خرید حذف شد');
      setInCart(false);
    } catch {
      toast.error('خطا در حذف محصول از سبد خرید');
    }
  };

  useEffect(() => {
    fetchProduct();
    checkCartStatus();
  }, [productId]);

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 pt-10 sm:flex-row flex-col-reverse">
        {/* Product Details */}
        <div className="flex-1 flex flex-col items-end">
          <div className="flex mt-2 flex-row-reverse items-center">
            <span style={{ background: product.color }} className="rounded w-6 h-6 ml-3 mb-2" />
            <h1 className="text-2xl font-medium">{product.name}</h1>
            <span className="mx-3 text-xs">
              {product.category} - {product.size}
            </span>
          </div>

          <p className="text-sm mt-2 text-[var(--color-gray)] italic">{product.create_at}</p>

          <p className="mt-5 text-lg font-bold text-[var(--color-gray)] flex items-center">
            {product.stock_status === 'IN STOCK' ? (
              discountPrice ? (
                <span className="text-[var(--color-[--color-black])] flex gap-x-1 items-center">
                  <img src={toman_icon} className="w-5 h-5" alt="تومان" />
                  {discountPrice}
                  <span className="mx-2 text-[var(--color-[--color-black])]">-</span>
                  <span className="line-through text-[--color-danger]">{price}</span>
                </span>
              ) : (
                <span className="flex gap-x-1 items-center">
                  <img src={toman_icon} className="w-5 h-5" alt="تومان" />
                  {price}
                </span>
              )
            ) : (
              <span className="text-[var(--color-danger)]">ناموجود</span>
            )}
          </p>

          <div
            className="mt-5 text-[var(--color-gray)] text-end"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <div className="grid grid-cols-2 gap-3 mt-5 lg:flex">
            <InfoBox title="سال عرضه" value={product.production} />
            <InfoBox title="نوع" value={product.size} />
            <InfoBox
              title="وضعیت"
              value={`${stockStatusToFarsi()} ( ${product.quantity} )`}
              fullWidth
            />
          </div>

          <div className="flex items-end mt-10">
            {token ? (
              product.stock_status === 'IN STOCK' ? (
                inCart ? (
                  <CartButton onClick={removeFromCart} text="حذف از سبد" danger />
                ) : (
                  <CartButton onClick={addToCart} text="افزودن به سبد" />
                )
              ) : (
                <CartButton text="ناموجود" disabled />
              )
            ) : (
              <CartButton onClick={() => navigate('/auth/pre')} text="ورود / ثبت نام" />
            )}
          </div>

          <hr className="mt-10 bg-[var(--color-light-gray)] h-[2px] w-full" />

          <div className="flex flex-col gap-2 mt-5 text-end text-[--color-gray]">
            <p>پشتیبانی ۲۴ ساعته</p>
            <p>سیاست بازگشت کالا</p>
            <p>پرداخت امن</p>
          </div>

          <ShareButtons />
        </div>

        {/* Image Section */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="w-full sm:w-[80%]">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full max-h-[600px] xl:max-h-[720px] object-cover rounded"
            />
          </div>
          <div className="flex sm:flex-col overflow-x-scroll sm:overflow-y-scroll justify-center sm:justify-normal sm:w-[18.7%] w-full">
            {images.map((img, idx) => (
              <img
                src={img}
                key={idx}
                onClick={() => setMainImage(img)}
                className="w-24 h-24 object-cover mx-2 sm:mx-0 sm:mb-3 flex-shrink-0 cursor-pointer rounded"
              />
            ))}
          </div>
        </div>
      </div>

      <NewProductsComponent />
    </div>
  );
}

const InfoBox = ({ title, value, fullWidth }) => (
  <div
    className={`flex flex-col items-center justify-center border border-[--color-black] px-2 py-3 ${
      fullWidth ? 'col-span-2' : ''
    } rounded`}
  >
    <p className="text-sm font-medium">
      {title} : {value}
    </p>
  </div>
);

const CartButton = ({ onClick, text, danger, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-[--color-black] text-white font-semibold text-sm px-10 py-4 rounded transition-all ${
      disabled
        ? 'cursor-default'
        : danger
          ? 'hover:bg-[var(--color-danger)]'
          : 'hover:bg-[var(--color-main)]'
    }`}
  >
    {text}
  </button>
);

export default ProductPage;
