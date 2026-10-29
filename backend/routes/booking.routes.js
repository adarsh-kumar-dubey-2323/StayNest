
import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isOwner } from "../middleware/isOwner.js"
import {
    getHotelBookings,
    bookRoom,
    checkRoomAvailability,
    getUserBookings,
    stripePayment,
} from "../controller/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post(
    "/check-availability",
    checkRoomAvailability
);

bookingRouter.post(
    "/book-room",
    isAuthenticated,
    bookRoom
);

bookingRouter.get(
    "/user",
    isAuthenticated,
    getUserBookings
);

bookingRouter.get(
    "/hotel",
    isAuthenticated,
    getHotelBookings
);

bookingRouter.post(
    "/stripe-payment",
    isAuthenticated,
    stripePayment
);

export default bookingRouter;
