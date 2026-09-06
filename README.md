# MERN Stack E-Commerce Application

A full-stack e-commerce platform built with MongoDB, Express.js, React, and Node.js (MERN), styled with Tailwind CSS. It features JWT user authentication, persistent shopping cart state, Stripe payment gateway integration alongside Cash on Delivery (COD), order management, user profiles, and a protected Admin Dashboard for managing products.

---

## Features

### **Customer Features**

* **User Authentication:** Secure registration, login with JWT, and persistent user sessions via `localStorage`.
* **Product Catalog:** Responsive grid view with search, filterable categories, and stock status indicators.
* **Product Detail Pages:** Individual product views with dynamic quantity selection and stock controls.
* **Persistent Shopping Cart:** Fully reactive shopping cart managed using React Context API and stored in `localStorage`.
* **Flexible Checkout & Payments:**
  * Integrated **Stripe Payment Gateway** for online credit/debit card transactions.
  * Supported **Cash on Delivery (COD)** checkout fallback.
* **User Dashboard:** Dedicated profile page for updating credentials and tracking past order history.

### **Admin Features**

* **Role-Based Access Control (RBAC):** Admin-only routing (`/admin`) protected by backend authorization middleware.
* **Inventory Management:** Comprehensive product creation, inventory tracking, and deletion directly from the dashboard.

---

## Tech Stack

* **Frontend:** React 18 (Vite), React Router v6, React Context API, Tailwind CSS, `@stripe/react-stripe-js`
* **Backend:** Node.js, Express.js, Mongoose (MongoDB ORM), JSON Web Tokens (JWT), Bcrypt.js, `stripe` Node SDK
* **Database:** MongoDB (Local or MongoDB Atlas)

---

## Getting Started

### Prerequisites

* **Node.js** (v16 or higher)
* **MongoDB** (Local instance or MongoDB Atlas cluster)
* **Stripe Account** (For retrieving API keys in Test Mode)

---

### Installation & Environment Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

#### 2. Backend Setup

Navigate to the `server` folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mernshop
JWT_SECRET=super_secret_jwt_key_dev_mode_12345
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

Seed initial sample products into MongoDB:

```bash
node seedProducts.js
```

Start the backend server:

\```bash
npm run dev
\```

*(Backend runs on `http://localhost:5000`)*

---

#### 3. Frontend Setup

Open a new terminal window, navigate to the `client` folder, and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
```

Start the frontend development server:

```bash
npm run dev
```

*(Frontend runs on `http://localhost:5173`)*

---

## API Endpoints Reference

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a new customer |
| `POST` | `/api/auth/login` | Public | Authenticate user & get token |
| `GET` | `/api/products` | Public | Get product catalog |
| `GET` | `/api/products/:id` | Public | Get product details by ID or slug |
| `POST` | `/api/products` | Admin | Add new product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |
| `POST` | `/api/payment/create-payment-intent` | Private | Create Stripe PaymentIntent |
| `POST` | `/api/orders` | Private | Submit new order |
| `GET` | `/api/orders/:id` | Private | Retrieve order summary |
| `GET` | `/api/users/profile` | Private | Fetch user details & order history |
| `PUT` | `/api/users/profile` | Private | Update user credentials |

---

## Promoting a User to Admin Role

1. Register an account through the app at `http://localhost:5173/register`.
2. Connect to your database using **MongoDB Compass** or `mongosh`.
3. Locate your account in the `users` collection.
4. Update the `role` field from `"customer"` to `"admin"`.
5. Log out and back in to gain access to `/admin`.
