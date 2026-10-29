import React, { useCallback, useContext, useEffect, useState } from "react";
import { Calendar, Users, CreditCard, Clock, XCircle, CheckCheck, Trash2 } from "lucide-react";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-hot-toast";

const Bookings = () => {
  const { axios } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/bookings/hotel");
      if (data.success) setBookings(data.bookings || []);
      else toast.error(data.message || "Could not load bookings.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const isCompleted = (checkOut) => Boolean(checkOut) && new Date(checkOut).getTime() < Date.now();
  const formatDate = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) return "—";
    return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };
  const statusClass = (status) => ({
    confirmed: "text-green-600",
    pending: "text-yellow-600",
    cancelled: "text-red-600",
  }[String(status || "").toLowerCase()] || "text-gray-600");
  const StatusIcon = ({ status }) => {
    const value = String(status || "").toLowerCase();
    if (value === "confirmed") return <CheckCheck size={18} />;
    if (value === "cancelled") return <XCircle size={18} />;
    return <Clock size={18} />;
  };

  // There is no delete-booking endpoint in the uploaded backend routes.
  // This only hides the completed booking in the current screen; it does not delete it from MongoDB.
  const hideCompletedBooking = (bookingId) => {
    if (!window.confirm("Hide this completed booking from this screen? This will not delete it from the database.")) return;
    setBookings((current) => current.filter((booking) => booking._id !== bookingId));
    toast.success("Booking hidden from this screen.");
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-10 text-center text-gray-600">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Hotel Bookings</h1>
          <p className="mt-2 text-gray-500">View bookings for your hotel.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <Calendar className="mx-auto mb-4 text-gray-400" size={50} />
            <h2 className="text-xl font-semibold text-gray-700">No Bookings Found</h2>
            <p className="mt-2 text-gray-500">There are no bookings to display.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const completed = isCompleted(booking.checkOut);
              const hotelName = booking.hotel?.hotelName || booking.hotel?.name || "Hotel";
              const roomType = booking.room?.roomType || "Room";
              const imageName = booking.room?.images?.[0];
              const imageSrc = imageName
                ? (String(imageName).startsWith("http") ? imageName : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/images/${imageName}`)
                : "";

              return (
                <article key={booking._id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{hotelName}</h2>
                      <p className="mt-1 text-sm text-gray-500">{roomType}</p>
                    </div>
                    <div className={`flex items-center gap-2 font-medium capitalize ${statusClass(booking.status)}`}>
                      <StatusIcon status={booking.status} />
                      <span>{booking.status || "pending"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-12">
                    <div className="md:col-span-4">
                      {imageSrc ? (
                        <img src={imageSrc} alt={roomType} className="h-48 w-full rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100 text-gray-400">No image</div>
                      )}
                    </div>
                    <div className="md:col-span-8">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Info icon={<Calendar size={20} />} label="Check-in" value={formatDate(booking.checkIn)} />
                        <Info icon={<Calendar size={20} />} label="Check-out" value={formatDate(booking.checkOut)} />
                        <Info icon={<Users size={20} />} label="Guests" value={booking.persons ?? "—"} />
                        <Info icon={<CreditCard size={20} />} label="Payment Method" value={booking.paymentMethod || "—"} />
                        <Info icon={<CreditCard size={20} />} label="Payment Status" value={booking.isPaid ? "Paid" : "Unpaid"} valueClass={booking.isPaid ? "text-green-600" : "text-red-600"} />
                        <Info label="Total Price" value={`₹${booking.totalPrice ?? 0}`} valueClass="text-lg font-bold" />
                      </div>
                      <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Booking ID</p>
                          <p className="break-all text-sm text-gray-600">{booking._id}</p>
                        </div>
                        {completed && (
                          <button onClick={() => hideCompletedBooking(booking._id)} className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 font-medium text-red-600 transition hover:bg-red-100" title="Hide completed booking">
                            <Trash2 size={18} /> Hide Completed Booking
                          </button>
                        )}
                      </div>
                      {completed && <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">The checkout date has passed. Hiding this item only removes it from the current screen, not from the database.</p>}
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

const Info = ({ icon, label, value, valueClass = "" }) => (
  <div className="flex items-start gap-3">
    {icon && <span className="mt-1 text-blue-500">{icon}</span>}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-medium text-gray-800 ${valueClass}`}>{value}</p>
    </div>
  </div>
);

export default Bookings;
