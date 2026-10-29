import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Rooms = () => {
  const { rooms } = useContext(AppContext);

  const roomList = Array.isArray(rooms) ? rooms : [];

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Available Rooms
        </h1>

        {roomList.length === 0 ? (
          <p className="text-gray-500">
            No rooms available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {roomList.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >

                {/* Room Image */}
                {room.images?.length > 0 && (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/${room.images[0]}`}
                    alt={room.roomType}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6">

                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {room.roomType}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">

                    <span className="text-xl font-bold text-green-600">
                      ${room.pricePerNight}/night
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        room.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {room.isAvailable
                        ? "Available"
                        : "Not Available"}
                    </span>

                  </div>

                  {/* Go to Single Room */}
                  <Link
                    to={`/rooms/${room._id}`}
                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                  >
                    View Room
                  </Link>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;