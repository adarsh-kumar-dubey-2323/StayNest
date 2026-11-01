# StayNest – Hotel Booking Platform

StayNest is a full-stack hotel booking web application where users can explore hotels, view rooms, and manage their bookings. Hotel owners can register their properties and manage rooms through an owner dashboard.

## 🌐 Live Demo

[Visit StayNest](https://staynesthotel.vercel.app)

## ✨ Features

### Guest Features
- Browse hotels and available rooms
- View room details and images
- Sign up, log in, and log out
- Book rooms by selecting dates
- View booking history

### Hotel Owner Features
- Register hotels and upload property images
- Add rooms with multiple images
- Manage hotels and room listings
- View and manage bookings through the owner dashboard

### Technical Features
- Responsive user interface
- REST API backend
- MongoDB database integration
- Cloudinary image uploads
- Authentication and protected routes
- Stripe payment integration

## 🛠️ Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary
- Stripe

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Image Storage: Cloudinary

## 📁 Project Structure

```text
StayNest/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── assets/
└── backend/
    ├── config/
    ├── controller/
    ├── middleware/
    ├── models/
    ├── routes/
    └── index.js
```

## 🚀 Run Locally

### Prerequisites
- Node.js and npm
- MongoDB connection string
- Cloudinary account
- Stripe account (for payment functionality)

### 1. Clone the repository

```bash
git clone https://github.com/adarsh-kumar-dubey-2323/StayNest.git
cd StayNest
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
```

Start the backend:

```bash
npm start
```

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown in your terminal.

## 🔐 Environment Variables

Never commit `.env` files or expose secret keys in the frontend. Configure production environment variables in the respective deployment dashboards.

## 👨‍💻 Author

**Adarsh Kumar Dubey**

- GitHub: [adarsh-kumar-dubey-2323](https://github.com/adarsh-kumar-dubey-2323)
- Project Repository: [StayNest](https://github.com/adarsh-kumar-dubey-2323/StayNest)
