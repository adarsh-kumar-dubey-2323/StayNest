
import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isOwner } from "../middleware/isOwner.js";
import {
  getAllHotels,
  getOwnerHotels,
  registerHotel,
  deleteHotel,
} from "../controller/hotel.controller.js";

import { upload } from "../config/multer.js";

const hotelRouter = express.Router();

// Register a new hotel
hotelRouter.post(
  "/register",
  isAuthenticated,
  isOwner,
  upload.single("image"),
  registerHotel
);

// Get hotels belonging to the logged-in owner
hotelRouter.get(
  "/get",
  isAuthenticated,
  isOwner,
  getOwnerHotels
);

// Get all hotels (public route)
hotelRouter.get("/get-all", getAllHotels);

// Delete a hotel
hotelRouter.delete(
  "/delete/:hotelId",
  isAuthenticated,
  isOwner,
  deleteHotel
);

export default hotelRouter;
