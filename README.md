# 🛍️ ShopEase — Modern Beauty E-Commerce Platform

A full-stack beauty & skincare e-commerce web app where users can browse products, add items to cart, place orders, and track them. Built with the MERN stack and deployed on Vercel.

![ShopEase Preview](./assets/shopease-preview.png)

> **Live Demo:** [shop-ease-nine-bice.vercel.app](https://shop-ease-nine-bice.vercel.app)

---

## ✨ Features

### 🛒 Shopping Experience
- Browse beauty & skincare products (serums, lipsticks, mascaras, etc.)
- View detailed product pages with images, pricing, and categories
- Add / remove products from cart with quantity control
- Persistent cart (saved per user)
- Checkout with Cash on Delivery option
- Order confirmation & tracking page

### 👤 User Authentication
- Secure user registration & login
- JWT-based authentication
- Protected routes (orders, checkout)
- Persistent login session

### 📦 Order Management
- View order history with status (Paid / Cash on Delivery)
- Order summary with item breakdown
- Estimated delivery dates
- Cancel order option

### 🎨 UI / UX
- Clean, modern beauty-brand aesthetic
- Fully responsive (mobile, tablet, desktop)
- Smooth animations & hover states
- Hero section, footer with quick links, benefit badges

---

## 🧰 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| **React.js** | UI library |
| **Vite** | Fast build tool |
| **React Router** | Client-side routing |
| **Context API** | Global state (cart, auth) |
| **CSS / Tailwind** | Styling |
| **Axios** | API requests |

### Backend
| Tech | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **CORS** | Cross-origin handling |
| **Morgan** | Request logging |

### Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend & backend hosting |
| **MongoDB Atlas** | Cloud database |

---

## 📁 Project Structure

```
ShopEase/
├── backend/
│   ├── config/           # DB connection
│   ├── controllers/      # Route logic
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── .env              # Secrets (gitignored)
│   ├── server.js         # Express entry point
│   ├── vercel.json       # Vercel config
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── context/      # Cart & auth context
│   │   ├── api/          # Axios instance
│   │   └── main.jsx
│   ├── .env              # Frontend env (VITE_API_URL)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── assets/
│   └── shopease-preview.png
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get single product |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/cart` | Get user's cart |
| POST | `/cart` | Add item to cart |
| PUT | `/cart/:id` | Update quantity |
| DELETE | `/cart/:id` | Remove item |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Place order |
| GET | `/orders` | Get user's orders |
| PUT | `/orders/:id/cancel` | Cancel order |

*(Route names may vary — check `backend/routes/` for exact paths.)*

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/sobiya681/ShopEase.git
cd ShopEase
```

### 2. Setup the backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8080
```

Run backend:
```bash
npm run dev
```
Backend runs at `http://localhost:8080`

### 3. Setup the frontend
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8080
```

Run frontend:
```bash
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## ☁️ Deployment (Vercel)

### Backend
1. Push project to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → import repo
3. **Root Directory:** `backend`
4. **Framework Preset:** Other
5. Add environment variables: `MONGO_URI`, `NODE_ENV=production`
6. Deploy → copy the backend URL

### Frontend
1. Import the **same repo** as a new Vercel project
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite
4. Add environment variable: `VITE_API_URL=https://your-backend.vercel.app`
5. Deploy

### MongoDB Atlas
- Network Access → allow `0.0.0.0/0` (Vercel uses dynamic IPs)

---

## 🔐 Security Notes

- ✅ Secrets stored in environment variables (never committed)
- ✅ Passwords hashed with bcrypt
- ✅ JWT-protected routes
- ✅ CORS restricted to known origins

---

## 📸 Screenshots

| Home | Cart | Orders |
|---|---|---|
| ![Home](./assets/shopease-preview.png) | ![](./assets/cart.png) | ![](./assets/orders.png) |

*(Add more screenshots to `assets/` and reference them here.)*

---

## 🛣️ Roadmap

- [ ] Stripe / card payment integration
- [ ] Product search & filter
- [ ] Product reviews & ratings
- [ ] Admin dashboard
- [ ] Wishlist feature
- [ ] Email order confirmation

---

## 👩‍💻 Author

**Sobia** — [@sobiya681](https://github.com/sobiya681)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If you like this project, please give it a star!**
