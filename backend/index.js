import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import ownerApplicationRouter from "./routes/ownerApplication.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = ["http://localhost:5173", "https://staynesthotel.vercel.app"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.status(200).send("StayNest backend is running!"));
app.use("/api/user", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/room", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/owner-applications", ownerApplicationRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => console.log(`StayNest backend running on port ${PORT}`));
  } catch (error) {
    console.error("StayNest server startup failed:", error.message);
    process.exit(1);
  }
};
startServer();
