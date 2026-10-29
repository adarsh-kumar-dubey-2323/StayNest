
import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import transporter from "../config/nodemailer.js";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Check room availability
export const checkAvailablity = async ({
    room,
    checkInDate,
    checkOutDate,
}) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (
        !room ||
        Number.isNaN(checkIn.getTime()) ||
        Number.isNaN(checkOut.getTime()) ||
        checkIn >= checkOut
    ) {
        throw new Error("Invalid room or booking dates");
    }

    const bookings = await Booking.find({
        room,
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
        isCancelled: { $ne: true },
    });

    return bookings.length === 0;
};

// POST /api/booking/check-availability
export const checkRoomAvailability = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;

        const isAvailable = await checkAvailablity({
            room,
            checkInDate,
            checkOutDate,
        });

        return res.json({
            success: true,
            isAvailable,
        });
    } catch (error) {
        console.error("Check availability error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Unable to check availability",
        });
    }
};

// POST /api/booking/book-room
export const bookRoom = async (req, res) => {
    try {
        const { id } = req.user;
        const {
            room,
            checkInDate,
            checkOutDate,
            persons,
            paymentMethod,
        } = req.body;

        if (!room || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "Room and booking dates are required",
            });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const guests = Number(persons);

        if (
            Number.isNaN(checkIn.getTime()) ||
            Number.isNaN(checkOut.getTime()) ||
            checkIn >= checkOut ||
            !Number.isInteger(guests) ||
            guests < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid dates or number of persons",
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const roomData = await Room.findById(room).populate("hotel");

        if (!roomData || !roomData.hotel) {
            return res.status(404).json({
                success: false,
                message: "Room or hotel not found",
            });
        }

        const isAvailable = await checkAvailablity({
            room,
            checkInDate: checkIn,
            checkOutDate: checkOut,
        });

        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                message: "Room is not available for these dates",
            });
        }

        const nights = Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) /
                (1000 * 60 * 60 * 24)
        );

        const totalPrice =
            Number(roomData.pricePerNight) * nights * guests;

        if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking price",
            });
        }

        const booking = await Booking.create({
            user: id,
            room,
            hotel: roomData.hotel._id,
            checkIn,
            checkOut,
            persons: guests,
            totalPrice,
            paymentMethod,
            isPaid: false,
        });

        // Email failure should not undo a successful booking creation.
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: "Room Booking Confirmation",
                html: `
                    <h2>Booking Details</h2>
                    <p>Dear ${user.name},</p>
                    <p>Your booking has been created successfully.</p>
                    <ul>
                        <li>Booking ID: ${booking._id}</li>
                        <li>Hotel: ${roomData.hotel.hotelName}</li>
                        <li>Room Type: ${roomData.roomType}</li>
                        <li>Check-in: ${checkIn.toDateString()}</li>
                        <li>Check-out: ${checkOut.toDateString()}</li>
                        <li>Guests: ${guests}</li>
                        <li>Total: ${process.env.CURRENCY || "$"} ${totalPrice}</li>
                    </ul>
                    <p>Payment status: Pending</p>
                `,
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Booking email error:", emailError);
        }

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking,
        });
    } catch (error) {
        console.error("Book room error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create booking",
        });
    }
};

// GET /api/booking/user
export const getUserBookings = async (req, res) => {
    try {
        const { id } = req.user;

        const bookings = await Booking.find({ user: id })
            .populate("room hotel")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error("Get user bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch bookings",
        });
    }
};

// GET /api/booking/hotel
export const getHotelBookings = async (req, res) => {
    try {
        const { id } = req.user;

        const hotels = await Hotel.find({ owner: id }).select("_id");
        const hotelIds = hotels.map((hotel) => hotel._id);

        const bookings = await Booking.find({
            hotel: { $in: hotelIds },
        })
            .populate("room hotel user")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error("Get hotel bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch hotel bookings",
        });
    }
};

// POST /api/booking/stripe-payment
export const stripePayment = async (req, res) => {
    try {
        const { id } = req.user;
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Only the booking's user can pay for it.
        if (String(booking.user) !== String(id)) {
            return res.status(403).json({
                success: false,
                message: "You cannot pay for this booking",
            });
        }

        if (booking.isPaid) {
            return res.status(400).json({
                success: false,
                message: "Booking is already paid",
            });
        }

        const roomData = await Room.findById(booking.room).populate("hotel");

        if (!roomData || !roomData.hotel) {
            return res.status(404).json({
                success: false,
                message: "Room or hotel not found",
            });
        }

        const origin = req.headers.origin;

        if (!origin) {
            return res.status(400).json({
                success: false,
                message: "Frontend origin is missing",
            });
        }

        // Stripe expects the amount in the smallest currency unit.
        // This example uses USD and assumes totalPrice is in dollars.
        const amountInCents = Math.round(
            Number(booking.totalPrice) * 100
        );

        if (!Number.isSafeInteger(amountInCents) || amountInCents < 50) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount",
            });
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: roomData.hotel.hotelName,
                            description: roomData.roomType,
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/loader/mybookings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/mybookings`,
            metadata: {
                bookingId: String(booking._id),
                userId: String(id),
            },
        });

        // Do not mark the booking paid here.
        // Verify payment through a Stripe webhook first.

        return res.json({
            success: true,
            url: session.url,
        });
    } catch (error) {
        console.error("Stripe payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to initiate payment",
        });
    }
};
