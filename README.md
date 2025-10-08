# MINI Models Shop

[![Screenshot-2025-10-08-195224.png](https://i.postimg.cc/63HFYM4y/Screenshot-2025-10-08-195224.png)](https://postimg.cc/VrC7NBR8)

Online Store for Miniature Models with Advanced Admin Panel

- Frontend : https://github.com/parsa-saadat/models-frontend/
- Backend : https://github.com/parsa-saadat/models-backend/

## 🛠 Technologies

**Frontend:** 
- React
- Vite
- JavaScript ES6+

**Backend:**
- Node.js 
- Express.js
- RESTful APIs

**Database:**
- MongoDB

## ⚙️ Installation & Setup

### Backend Setup

```bash
cd backend
npm install
```

### Backend Environment Variables (.env)

```env
# App config
STATUS=DEV
CLIENT_URL=http://localhost:5173
PORT=3000
HOST=localhost
PROTOCOL=http

# CROS Config
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE,PATCH
CORS_ALLOWED_HEADERS=Content-Type,Authorization

# LOG Config
LOG_FILE_PATH=./log/http.log

# MongoDB Config
MONGO_URI=mongodb://localhost:27017/
MONGO_DATABASE_NAME=utopia

# Storage
MAX_MB_UPLOAD_SIZE=5

# Website Config
DEFAULT_NULL_IMAGE_ID=60a4933312896b00042d5335

# Payment Config
VERIFY_PAYMENT_CALLBACK_PAHT=/orders/verify
VERIFY_PAYMENT_CALLBACK_URL=http://localhost:3000/orders/verify

# Zarinpal payment Config
ZARINPAL_MERCHANT_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
ZARINPAL_PAYMENT_REQUEST_URL=https://sandbox.zarinpal.com/pg/v4/payment/request.json
ZARINPAL_VERIFY_PAYMENT_URL=https://sandbox.zarinpal.com/pg/v4/payment/verify.json
ZARINPAL_REFUND_URL=https://sandbox.zarinpal.com/pg/v4/payment/refund.json
ZARINPAL_PAY_URL=https://sandbox.zarinpal.com/pg/StartPay

# Sms Config
KAVENEGAR_API_KEY=617A6950335479755646743547752F77777759346A4A5676656E72795A5844512F6D31304C7A54546D61787637673D
KAVENEGAR_SENDER_NUMBER=XXXXXXXXXX
KAVENEGAR_RECEIVER_NUMBER=XXXXXXXXXX
KAVENEGAR_VERIFY_TEMPLATE_NAME=verify

# Order Config
PROCCESSING_DAYS=2
REFUND_PERCENTAGE=25
SHIPPING_DAYS=6
SHIPPING_EXPRESS_DAYS=4
HOLIDAYS="2025-03-21","2025-03-22","2025-03-23","2025-03-24","2025-04-01","2025-04-02","2025-06-04","2025-06-05","2025-02-11","2025-03-19","2025-04-19","2025-03-31","2025-04-01","2025-06-06","2025-06-07","2025-06-15","2025-07-26","2025-07-27","2025-09-23","2025-09-25","2025-10-02","2025-05-06"
EXPRESS_SHIPPING_COST=600000
STANDARD_SHIPPING_COST=300000

# Security Config
JWT_SECRET="UlfPK62K(?L2cz;8!y'ROcK<OYam_.'u&PoYX;+sz"t,'86,y_h707%M3ms!"
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## ✨ Key Features

### 💳 Payment System
- ZarinPal gateway integration
- Test payments in development environment
- Automatic payment verification
- 25% refund system

### 👨‍💼 Admin Panel
- User management 👥
- Media management 🖼️
- Website frontend settings ⚙️
- Order management 📦
- User address management 🏠
- Log monitoring 📊

### 🚚 Shipping System
- Express shipping (4 business days) ⚡
- Standard shipping (6 business days) 📦
- Smart delivery date calculation considering holidays

## 🚀 Running the Application

### Backend Server
```bash
cd backend
npm start
```
**Expected output:** `Server is running on localhost port 3000`

### Frontend
```bash
cd frontend
npm start
```
**Access:** http://localhost:3000

## 🔒 Security Features

- JWT-based authentication
- Secure payments
- CORS configuration
- File upload validation
- Environment variables protection

## 🧪 Payment Testing

Use ZarinPal sandbox environment to test payments without real financial transactions.

---

**Built with modern technologies for an exceptional e-commerce experience!** 🚀
