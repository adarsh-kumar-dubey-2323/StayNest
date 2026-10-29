
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Eye,
  Mountain,
  Wifi,
  Tv,
  Coffee,
  User,
  Bed,
  Bath,
  Phone,
  Star,
  MapPin,
  Car,
  Wind,
  Refrigerator,
  CheckCircle,
  Calendar,
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const SingleRoom = () => {
  const { rooms, fetchRooms, axios: api, user } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState(0);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    persons: 1,
  });

  const roomList = Array.isArray(rooms) ? rooms : [];

  const room = roomList.find(
    (item) => String(item._id) === String(id)
  );

  const backendUrl = (
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
  ).replace(/\/$/, "");

  // Fetch rooms if they are not yet available in context.
  useEffect(() => {
    if (!room && typeof fetchRooms === "function") {
      fetchRooms();
    }
  }, [id, room, fetchRooms]);

  // Convert stored image filenames to usable image URLs.
  const images = Array.isArray(room?.images)
    ? room.images
        .filter((image) => typeof image === "string" && image.length > 0)
        .map((image) =>
          image.startsWith("http")
            ? image
            : `${backendUrl}/images/${image.replace(/^\/+/, "")}`
        )
    : [];

  const roomAmenities = Array.isArray(room?.amenities)
    ? room.amenities
    : [];

  const hotelAmenities = Array.isArray(room?.hotel?.amenities)
    ? room.hotel.amenities
    : [];

  const checkInMin = new Date().toLocaleDateString("en-CA");

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setBookingData((current) => ({
      ...current,
      [name]: name === "persons" ? Number(value) : value,
    }));

    // Dates or guest count changed, so recheck before booking.
    setIsAvailable(false);
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "Free WiFi": Wifi,
      Wifi,
      TV: Tv,
      "Air Conditioning": Wind,
      "Air Ventilation": Wind,
      Breakfast: Coffee,
      Bathtub: Bath,
      Bed,
      "Mountain View": Mountain,
      "Ocean View": Eye,
      "Panoramic View": Eye,
      "Room Service": Coffee,
      "Mini Bar": Refrigerator,
      Parking: Car,
      "Car Parking": Car,
      "Swimming Pool": CheckCircle,
      Phone,
      User,
    };

    return iconMap[amenity] || CheckCircle;
  };

  const checkRoomAvailability = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return false;
    }

    if (bookingData.checkIn < checkInMin) {
      toast.error("Check-in date cannot be in the past.");
      return false;
    }

    if (bookingData.checkIn >= bookingData.checkOut) {
      toast.error("Check-out must be after check-in.");
      return false;
    }

    if (!Number.isInteger(Number(bookingData.persons)) ||
        Number(bookingData.persons) < 1) {
      toast.error("Please enter a valid number of guests.");
      return false;
    }

    try {
      setCheckingAvailability(true);
      setIsAvailable(false);

      const { data } = await api.post(
        "/api/bookings/check-availability",
        {
          room: room._id,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut,
        }
      );

      if (data.success && data.isAvailable) {
        setIsAvailable(true);
        toast.success("Room is available for these dates.");
        return true;
      }

      toast.error(data.message || "Room is not available for these dates.");
      return false;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not check room availability."
      );
      return false;
    } finally {
      setCheckingAvailability(false);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // First click checks availability. The next click books the room.
    if (!isAvailable) {
      await checkRoomAvailability();
      return;
    }

    if (!user) {
      toast.error("Please log in to book this room.");
      navigate("/login");
      return;
    }

    try {
      setBookingLoading(true);

      const { data } = await api.post("/api/bookings/book-room", {
        room: room._id,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        persons: Number(bookingData.persons),
        paymentMethod: "Pay At Hotel",
      });

      if (!data.success) {
        setIsAvailable(false);
        toast.error(data.message || "Booking could not be created.");
        return;
      }

      toast.success(data.message || "Booking created successfully.");
      navigate("/mybookings");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setIsAvailable(false);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Booking could not be created."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Show a friendly message if the requested room is not in the list.
  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Room not found
        </h1>
        <p className="mt-3 text-gray-500">
          The room may have been removed or is still loading.
        </p>
        <Link
          to="/rooms"
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Browse all rooms
        </Link>
      </div>
    );
  }

  const price = Number(room.pricePerNight) || 0;

  const nights =
    bookingData.checkIn && bookingData.checkOut &&
    bookingData.checkIn < bookingData.checkOut
      ? Math.ceil(
          (new Date(bookingData.checkOut) -
            new Date(bookingData.checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalPrice = price * nights;

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link
          to="/rooms"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to rooms
        </Link>

        {/* Room header */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
                {room.roomType || "Room"}
              </h1>

              {room.hotel?.hotelName && (
                <p className="mt-2 text-lg text-gray-600">
                  {room.hotel.hotelName}
                </p>
              )}

              {room.hotel?.hotelAddress && (
                <p className="mt-3 flex items-center gap-2 text-gray-500">
                  <MapPin size={18} />
                  {room.hotel.hotelAddress}
                </p>
              )}

              {room.hotel?.rating != null && (
                <p className="mt-3 flex items-center gap-2 text-amber-500">
                  <Star size={18} className="fill-amber-400" />
                  <span className="font-semibold">
                    {room.hotel.rating}
                  </span>
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <p className="text-3xl font-bold text-green-600">
                ₹{price.toLocaleString("en-IN")}
                <span className="text-base font-normal text-gray-500">
                  {" "}/ night
                </span>
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                  room.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {room.isAvailable ? "Available" : "Currently unavailable"}
              </span>

              {room.hotel?.owner?.name && (
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-600 sm:justify-end">
                  <User size={16} />
                  {room.hotel.owner.name}
                </p>
              )}

              {room.hotel?.owner?.email && (
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-600 sm:justify-end">
                  <Phone size={16} />
                  {room.hotel.owner.email}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Room information */}
          <div className="space-y-8 lg:col-span-2">
            {/* Image gallery */}
            <section className="rounded-2xl bg-white p-5 shadow-lg sm:p-8">
              <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Room Gallery
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Explore the room images.
              </p>

              {images.length > 0 ? (
                <>
                  <img
                    src={images[Math.min(selectedImage, images.length - 1)]}
                    alt={`${room.roomType} image`}
                    className="h-72 w-full rounded-xl bg-gray-100 object-cover sm:h-[440px]"
                  />

                  {images.length > 1 && (
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                      {images.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() => setSelectedImage(index)}
                          className={`overflow-hidden rounded-lg ${
                            selectedImage === index
                              ? "ring-4 ring-blue-500"
                              : "opacity-75 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Room view ${index + 1}`}
                            className="h-20 w-full object-cover sm:h-24"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-72 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                  No room images available.
                </div>
              )}
            </section>

            {/* Description */}
            <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                About this room
              </h2>
              <p className="whitespace-pre-line leading-7 text-gray-600">
                {room.description || "No description available."}
              </p>
            </section>

            {/* Room amenities */}
            <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h2 className="mb-5 text-2xl font-bold text-gray-800">
                Room amenities
              </h2>

              {roomAmenities.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {roomAmenities.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity);

                    return (
                      <div
                        key={`${amenity}-${index}`}
                        className="flex items-center gap-3 rounded-lg bg-blue-50 p-3"
                      >
                        <Icon size={20} className="shrink-0 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          {amenity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">
                  No room amenities listed.
                </p>
              )}
            </section>

            {/* Hotel amenities */}
            <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <h2 className="mb-5 text-2xl font-bold text-gray-800">
                Hotel amenities
              </h2>

              {hotelAmenities.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {hotelAmenities.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity);

                    return (
                      <div
                        key={`${amenity}-${index}`}
                        className="flex items-center gap-3 rounded-lg bg-blue-50 p-3"
                      >
                        <Icon size={20} className="shrink-0 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          {amenity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">
                  No hotel amenities listed.
                </p>
              )}
            </section>
          </div>

          {/* Booking panel */}
          <aside>
            <div className="rounded-2xl bg-white p-6 shadow-lg lg:sticky lg:top-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Book this room
              </h2>

              <form onSubmit={onSubmitHandler} className="space-y-5">
                <div>
                  <label
                    htmlFor="checkIn"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    <Calendar size={17} className="mr-2 inline" />
                    Check-in date
                  </label>
                  <input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    required
                    min={checkInMin}
                    value={bookingData.checkIn}
                    onChange={onChangeHandler}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkOut"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    <Calendar size={17} className="mr-2 inline" />
                    Check-out date
                  </label>
                  <input
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    required
                    min={bookingData.checkIn || checkInMin}
                    value={bookingData.checkOut}
                    onChange={onChangeHandler}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="persons"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    <User size={17} className="mr-2 inline" />
                    Number of guests
                  </label>
                  <input
                    id="persons"
                    name="persons"
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={bookingData.persons}
                    onChange={onChangeHandler}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-3 border-t pt-5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Price per night</span>
                    <span>₹{price.toLocaleString("en-IN")}</span>
                  </div>

                  {nights > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>
                        {nights} {nights === 1 ? "night" : "nights"}
                      </span>
                      <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Room subtotal</span>
                    <span>
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Final charges may depend on your booking details.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    checkingAvailability ||
                    bookingLoading ||
                    !room.isAvailable
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {(checkingAvailability || bookingLoading) && (
                    <LoaderCircle size={18} className="animate-spin" />
                  )}

                  {checkingAvailability
                    ? "Checking availability..."
                    : bookingLoading
                    ? "Creating booking..."
                    : !room.isAvailable
                    ? "Room unavailable"
                    : isAvailable
                    ? "Book now"
                    : "Check availability"}
                </button>

                {!user && (
                  <p className="text-center text-xs text-gray-500">
                    You will need to log in to complete your booking.
                  </p>
                )}
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SingleRoom;
