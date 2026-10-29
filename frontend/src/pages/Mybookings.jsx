
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Calendar,
  Users,
  CreditCard,
  Clock,
  XCircle,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const { axios } = useContext(AppContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBookingId, setPayingBookingId] = useState("");

  // Fetch logged-in user's bookings
  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/bookings/user");

      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message || "Could not load your bookings.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not load your bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  // Start Stripe payment
  const handlePayment = async (bookingId) => {
    if (payingBookingId) return;

    try {
      setPayingBookingId(bookingId);

      const { data } = await axios.post(
        "/api/bookings/stripe-payment",
        { bookingId }
      );

      if (data.success && data.url) {
        window.location.assign(data.url);
      } else {
        toast.error(data.message || "Could not start payment.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Payment could not be started."
      );
    } finally {
      setPayingBookingId("");
    }
  };

  // Check whether checkout date has passed
  const isCompleted = (checkOut) =>
    Boolean(checkOut) &&
    new Date(checkOut).getTime() < Date.now();

  // Format dates
  const formatDate = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Booking status color
  const statusClass = (status) =>
    ({
      confirmed: "text-green-600",
      pending: "text-yellow-600",
      cancelled: "text-red-600",
    }[String(status || "").toLowerCase()] || "text-gray-600");

  // Booking status icon
  const StatusIcon = ({ status }) => {
    const value = String(status || "").toLowerCase();

    if (value === "confirmed") {
      return <CheckCheck size={18} />;
    }

    if (value === "cancelled") {
      return <XCircle size={18} />;
    }

    return <Clock size={18} />;
  };

  // Hide a completed booking from the current screen only.
  // This does not delete the booking from the database.
  const hideCompletedBooking = (bookingId) => {
    const confirmed = window.confirm(
      "Hide this completed booking from this screen? It will remain in the database."
    );

    if (!confirmed) return;

    setBookings((current) =>
      current.filter((booking) => booking._id !== bookingId)
    );

    toast.success("Booking hidden from this screen.");
  };

  // Loading screen — top padding prevents navbar overlap
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pt-28 pb-10 text-center text-gray-600 sm:px-6 lg:px-8">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-28 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-9">
          <h1 className="text-3xl font-bold text-gray-800">
            My Bookings
          </h1>

          <p className="mt-2 text-gray-500">
            View your reservations and payment status.
          </p>
        </div>

        {/* Empty state */}
        {bookings.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <Calendar
              className="mx-auto mb-4 text-gray-400"
              size={50}
            />

            <h2 className="text-xl font-semibold text-gray-700">
              No Bookings Found
            </h2>

            <p className="mt-2 text-gray-500">
              You don't have any bookings yet.
            </p>
          </div>
        ) : (
          /* Booking cards */
          <div className="space-y-6">
            {bookings.map((booking) => {
              const completed = isCompleted(booking.checkOut);

              const hotelName =
                booking.hotel?.hotelName ||
                booking.hotel?.name ||
                "Hotel";

              const roomType = booking.room?.roomType || "Room";
              const imageName = booking.room?.images?.[0];

              const backendUrl = (
                import.meta.env.VITE_BACKEND_URL ||
                "http://localhost:4000"
              ).replace(/\/$/, "");

              const imageSrc = imageName
                ? String(imageName).startsWith("http")
                  ? imageName
                  : `${backendUrl}/images/${imageName}`
                : "";

              return (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* Hotel and status */}
                  <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {hotelName}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {roomType}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-2 font-medium capitalize ${statusClass(
                        booking.status
                      )}`}
                    >
                      <StatusIcon status={booking.status} />
                      <span>{booking.status || "pending"}</span>
                    </div>
                  </div>

                  {/* Booking details */}
                  <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-12">
                    {/* Room image */}
                    <div className="md:col-span-4">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={roomType}
                          className="h-48 w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Booking information */}
                    <div className="md:col-span-8">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Info
                          icon={<Calendar size={20} />}
                          label="Check-in"
                          value={formatDate(booking.checkIn)}
                        />

                        <Info
                          icon={<Calendar size={20} />}
                          label="Check-out"
                          value={formatDate(booking.checkOut)}
                        />

                        <Info
                          icon={<Users size={20} />}
                          label="Guests"
                          value={booking.persons ?? "—"}
                        />

                        <Info
                          icon={<CreditCard size={20} />}
                          label="Payment Method"
                          value={booking.paymentMethod || "—"}
                        />

                        {/* Payment status */}
                        <div className="flex items-start gap-3">
                          <CreditCard
                            size={20}
                            className="mt-1 text-blue-500"
                          />

                          <div>
                            <p className="text-sm text-gray-500">
                              Payment Status
                            </p>

                            <button
                              type="button"
                              disabled={
                                Boolean(booking.isPaid) ||
                                payingBookingId === booking._id
                              }
                              onClick={() => handlePayment(booking._id)}
                              className={`font-medium ${
                                booking.isPaid
                                  ? "cursor-default text-green-600"
                                  : "cursor-pointer text-red-600 hover:underline"
                              } disabled:opacity-70`}
                            >
                              {booking.isPaid
                                ? "Paid"
                                : payingBookingId === booking._id
                                ? "Opening payment..."
                                : "Pay Now"}
                            </button>
                          </div>
                        </div>

                        <Info
                          label="Total Price"
                          value={`₹${booking.totalPrice ?? 0}`}
                          valueClass="text-lg font-bold"
                        />
                      </div>

                      {/* Booking ID and completed booking action */}
                      <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs text-gray-400">
                            Booking ID
                          </p>

                          <p className="break-all text-sm text-gray-600">
                            {booking._id}
                          </p>
                        </div>

                        {completed && (
                          <button
                            type="button"
                            onClick={() =>
                              hideCompletedBooking(booking._id)
                            }
                            className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 font-medium text-red-600 transition hover:bg-red-100"
                            title="Hide completed booking"
                          >
                            <Trash2 size={18} />
                            Hide Completed Booking
                          </button>
                        )}
                      </div>

                      {completed && (
                        <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                          The checkout date has passed. Hiding this
                          item only removes it from this screen, not
                          from the database.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable booking detail component
const Info = ({ icon, label, value, valueClass = "" }) => (
  <div className="flex items-start gap-3">
    {icon && (
      <span className="mt-1 text-blue-500">
        {icon}
      </span>
    )}

    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-medium text-gray-800 ${valueClass}`}>
        {value}
      </p>
    </div>
  </div>
);

export default MyBookings;
