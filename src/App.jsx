import { Routes, Route } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';

// Pages
import HomePage from './pages/main/HomePage';
import ShopPage from './pages/main/ShopPage';
import AboutPage from './pages/main/AboutPage';
import ContactPage from './pages/main/ContactPage';
import CartPage from './pages/main/CartPage';
import EditAddressPage from './pages/main/address/EditAddressPage';
import AddressPage from './pages/main/address/AddressPage';
import ProductPage from './pages/main/ProductPage';
import ProfilePage from './pages/main/ProfilePage';
import PrePage from './pages/main/auth/PrePage';
import VerifyPage from './pages/main/auth/VerifyPage';
import CreateOrderPage from './pages/main/order/CreateOrderPage';
import OrdersPage from './pages/main/order/OrdersPage';
import SingleOrderPage from './pages/main/order/SingleOrderPage';

// Dashboard Pages
import AdminAddressPage from './pages/dashboard/AddressPage';
import UsersPage from './pages/dashboard/UsersPage';
import AdminOrders from './pages/dashboard/OrdersPage';
import ProductsPage from './pages/dashboard/ProductsPage';
import LogsPage from './pages/dashboard/LogsPage';
import CounterPage from './pages/dashboard/CounterPage';
import MediaPage from './pages/dashboard/MediaPage';
import SettingPage from './pages/dashboard/SettingPage';
import VerifyAdminPage from './pages/authAdmin/VerifyAdminPage';
import PreAdminPage from './pages/authAdmin/PreAdminPage';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthAdminLayout';

// Context
import { SettingsProvider } from './contexts/SettingsContext';

const App = () => {
  return (
    <SettingsProvider>
      <MainApp />
    </SettingsProvider>
  );
};

const MainApp = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/address/:addressId" element={<EditAddressPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth/pre" element={<PrePage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route path="/order/create" element={<CreateOrderPage />} />
          <Route path="/order" element={<OrdersPage />} />
          <Route path="/order/:orderId" element={<SingleOrderPage />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<CounterPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="setting" element={<SettingPage />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="address" element={<AdminAddressPage />} />
          <Route path="medias" element={<MediaPage />} />
        </Route>

        {/* Admin Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard/pre" element={<PreAdminPage />} />
          <Route path="/dashboard/verify" element={<VerifyAdminPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
