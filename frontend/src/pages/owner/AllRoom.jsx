import { useState, useContext, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import {
  Phone,
  Star,
  IndianRupee,
  Trash2,
  Edit,
  Eye,
  BedDouble,
  Hotel,
  Users,
} from "lucide-react";
import {toast} from "react-hot-toast";

const AllRoom = () => {
  const { axios } = useContext(AppContext);
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchOwnerRooms = useCallback(async () => {
    try{
       const {data} = await axios.get("/api/room/get");
       if(data.success){
        setRoomData(data.rooms || []);
       } else {
        toast.error(data.message || "Failed to fetch rooms.");
       }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch rooms.");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchOwnerRooms();
  }, [fetchOwnerRooms]);
  

  const navigate = useNavigate();

  // ================= DELETE ROOM =================
  const handleDeleteRoom = async (roomId) => {
    if (!roomId) {
      toast.error("Room ID is missing.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const { data } = await axios.delete(`/api/room/delete/${roomId}`);
      if (data.success) {
        setRoomData((current) => current.filter((room) => room._id !== roomId));
        toast.success(data.message || "Room deleted successfully.");
      } else {
        toast.error(data.message || "Could not delete room.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Could not delete room.");
    }
  };

  // ================= EDIT ROOM =================
  const handleEditRoom = () => {
    toast.error("Room editing page is not configured yet.");
  };

  // ================= VIEW ROOM =================
  const handleViewRoom = (room) => {
    if (room?._id) navigate(`/rooms/${room._id}`);
    else toast.error("Room ID is missing.");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1700px]">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
              All Rooms
            </h1>

            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage all registered rooms from one place
            </p>
          </div>

          <motion.button
            onClick={() => navigate("/owner/addroom")}
            whileHover={{ scale: 0.97 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              ease: "easeInOut",
              duration: 0.2,
            }}
            className="w-full shrink-0 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg sm:w-auto"
          >
            Add New Room
          </motion.button>
        </div>

        {/* =====================================================
            ROOM TABLE
        ====================================================== */}
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* Horizontal scrolling prevents columns from collapsing */}
          <div className="w-full overflow-x-auto">

            <table className="min-w-[1550px] w-full table-fixed">

              {/* =================================================
                  TABLE HEADER
              ================================================== */}
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>

                  <th className="w-[260px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Room
                  </th>

                  <th className="w-[230px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Hotel
                  </th>

                  <th className="w-[150px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Room Type
                  </th>

                  <th className="w-[150px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Capacity
                  </th>

                  <th className="w-[170px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Price / Night
                  </th>

                  <th className="w-[120px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Rating
                  </th>

                  <th className="w-[270px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Amenities
                  </th>

                  <th className="w-[170px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Action
                  </th>

                </tr>
              </thead>

              {/* =================================================
                  TABLE BODY
              ================================================== */}
              <tbody className="divide-y divide-gray-100">

                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center text-gray-500">Loading rooms...</td>
                  </tr>
                ) : roomData.length > 0 ? (

                  roomData.map((room, index) => (

                    <tr
                      key={room._id}
                      className={`transition-colors duration-200 hover:bg-blue-50 ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                      }`}
                    >

                      {/* =================================================
                          ROOM
                      ================================================== */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex min-w-0 items-center gap-4">

                          <img
                            src={room.images?.[0] ? (String(room.images[0]).startsWith("http") ? room.images[0] : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/images/${room.images[0]}`) : ""}
                            alt={room.roomType}
                            className="h-16 w-20 shrink-0 rounded-xl object-cover shadow-md"
                          />

                          <div className="min-w-0">

                            <h3 className="truncate text-sm font-bold text-gray-800">
                              {room.name || room.roomType || "Room"}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              Room ID: #{room._id}
                            </p>

                            {room.roomNumber && (
                              <p className="mt-1 text-xs font-medium text-blue-600">
                                Room No: {room.roomNumber}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* =================================================
                          HOTEL
                      ================================================== */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                            <Hotel
                              size={19}
                              className="text-blue-600"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="break-words text-sm font-semibold text-gray-800">
                              {room.hotel?.hotelName || room.hotelName || room.hotel?.name || "Hotel"}
                            </p>

                            {(room.hotel?._id || room.hotelId) && (
                              <p className="mt-1 text-xs text-gray-500">
                                Hotel ID: #{room.hotel?._id || room.hotelId}
                              </p>
                            )}
                          </div>

                        </div>

                      </td>

                      {/* =================================================
                          ROOM TYPE
                      ================================================== */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center gap-2">

                          <BedDouble
                            size={18}
                            className="shrink-0 text-indigo-600"
                          />

                          <span className="text-sm font-semibold text-gray-700">
                            {room.roomType ||
                              room.type ||
                              "Standard"}
                          </span>

                        </div>

                      </td>

                      {/* =================================================
                          CAPACITY
                      ================================================== */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center gap-2">

                          <Users
                            size={17}
                            className="shrink-0 text-green-600"
                          />

                          <span className="whitespace-nowrap text-sm font-medium text-gray-700">
                            {room.capacity ||
                              room.guests ||
                              room.maxGuests ||
                              2}{" "}
                            Guests
                          </span>

                        </div>

                      </td>

                      {/* =================================================
                          PRICE
                      ================================================== */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center gap-1">

                          <IndianRupee
                            size={16}
                            className="shrink-0 text-gray-700"
                          />

                          <span className="whitespace-nowrap font-bold text-gray-800">
                            {String(
                              room.price ||
                                room.pricePerNight ||
                                0
                            ).replace("$", "")}
                          </span>

                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          per night
                        </p>

                      </td>

                      {/* =================================================
                          RATING
                      ================================================== */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center gap-2">

                          <Star
                            size={18}
                            className="shrink-0 fill-yellow-400 text-yellow-400"
                          />

                          <span className="font-bold text-gray-800">
                            {room.rating || "N/A"}
                          </span>

                        </div>

                      </td>

                      {/* =================================================
                          AMENITIES
                      ================================================== */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex max-w-[240px] flex-wrap gap-2">

                          {room.amenities &&
                          room.amenities.length > 0 ? (

                            room.amenities.map(
                              (amenity, amenityIndex) => (

                                <span
                                  key={amenityIndex}
                                  className="whitespace-nowrap rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                                >
                                  {amenity}
                                </span>

                              )
                            )

                          ) : (

                            <span className="text-xs text-gray-400">
                              No amenities
                            </span>

                          )}

                        </div>

                      </td>

                      {/* =================================================
                          ACTIONS
                      ================================================== */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center gap-2">

                          {/* VIEW */}
                          <motion.button
                            onClick={() => handleViewRoom(room)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition hover:bg-blue-200"
                            title="View Room"
                          >
                            <Eye size={18} />
                          </motion.button>

                          {/* EDIT */}
                          <motion.button
                            onClick={() => handleEditRoom(room)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 transition hover:bg-yellow-200"
                            title="Edit Room"
                          >
                            <Edit size={18} />
                          </motion.button>

                          {/* DELETE */}
                          <motion.button
                            onClick={() => handleDeleteRoom(room._id)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 transition hover:bg-red-200"
                            title="Delete Room"
                          >
                            <Trash2 size={18} />
                          </motion.button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  /* =================================================
                     EMPTY STATE
                  ================================================== */
                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                          <BedDouble
                            size={28}
                            className="text-blue-600"
                          />
                        </div>

                        <h3 className="text-xl font-bold text-gray-700">
                          No Rooms Found
                        </h3>

                        <p className="mt-2 text-gray-500">
                          No rooms are currently registered.
                        </p>

                        <button
                          onClick={() =>
                            navigate("/owner/addroom")
                          }
                          className="mt-5 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
                        >
                          Register Room
                        </button>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AllRoom;
