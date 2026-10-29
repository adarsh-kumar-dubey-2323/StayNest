import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Phone,
  Star,
  IndianRupee,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";

const AllHotels = () => {
  const { hotels, axios } = useContext(AppContext);

const [hotelData, setHotelData] = useState([]);
const fetchOwnerHotels = async () => {
  try{
    const {data} = await axios.get("/api/hotel/get");
    if(data.success){
      setHotelData(data.hotels || []);
    } else {
      toast.error(data.message || "Failed to fetch hotels.");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Failed to fetch hotels.");
  }
};

useEffect(() => {
  fetchOwnerHotels();
}, [axios]);

const deleteHotel = async(id)=>{
  try{
     const { data } = await axios.delete(`/api/hotel/delete/${id}`);
      if (data.success) {
        setHotelData((current) => current.filter((hotel) => hotel._id !== id));
        toast.success(data.message || "Hotel deleted successfully.");
      } else {
        toast.error(data.message || "Could not delete hotel.");
      }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Could not delete hotel.");
  }
};
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">

      <div className="mx-auto w-full max-w-[1600px]">

        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
              Premium Hotels Collection
            </h1>

            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Discover exceptional stays around the world
            </p>
          </div>

          <motion.button
            onClick={() => navigate("/owner/registerhotel")}
            whileHover={{ scale: .95 }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="w-full shrink-0 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg sm:w-auto"
          >
            Register Hotel
          </motion.button>

        </div>


        {/* ================= HOTEL TABLE ================= */}
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* Horizontal scrolling prevents columns from collapsing */}
          <div className="w-full overflow-x-auto">

            <table className="min-w-[1500px] w-full table-fixed">

              {/* ================= TABLE HEADER ================= */}
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">

                <tr>

                  <th className="w-[260px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Hotel
                  </th>

                  <th className="w-[250px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Location
                  </th>

                  <th className="w-[190px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Hotel Owner
                  </th>

                  <th className="w-[210px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Contact
                  </th>

                  <th className="w-[120px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Rating
                  </th>

                  <th className="w-[150px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Price/Night
                  </th>

                  <th className="w-[250px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Amenities
                  </th>

                  <th className="w-[170px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Action
                  </th>

                </tr>

              </thead>


              {/* ================= TABLE BODY ================= */}
              <tbody className="divide-y divide-gray-100">

                {hotelData && hotelData.length > 0 ? (

                  hotelData.map((hotel, index) => (

                    <tr
                      key={hotel._id}
                      className={`transition-colors duration-200 hover:bg-blue-50 ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                      }`}
                    >

                      {/* ================= HOTEL ================= */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex min-w-0 items-center gap-4">

                          <img
                            src={hotel.image ? (hotel.image.startsWith("http") ? hotel.image : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/images/${hotel.image}`) : ""}
                            alt={hotel.hotelName}
                            className="h-16 w-20 shrink-0 rounded-xl object-cover shadow-md"
                          />

                          <div className="min-w-0">

                            <h3 className="truncate text-sm font-bold text-gray-800">
                              {hotel.hotelName}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              Hotel ID: #{hotel._id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* ================= LOCATION ================= */}
                      <td className="px-5 py-5 align-middle">

                        <p className="break-words text-sm leading-6 text-gray-600">
                          {hotel.hotelAddress}
                        </p>

                      </td>


                      {/* ================= OWNER ================= */}
                      <td className="px-5 py-5 align-middle">

                        <div className="min-w-0">

                          <p className="break-words text-sm font-semibold text-gray-800">
                            {hotel.owner?.name || "—"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Hotel Owner
                          </p>

                        </div>

                      </td>


                      {/* ================= CONTACT ================= */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex min-w-0 items-center gap-3">

                          <Phone
                            size={17}
                            className="shrink-0 text-green-600"
                          />

                          <span className="whitespace-nowrap text-sm text-gray-600">
                            +9999999999
                          </span>

                        </div>

                      </td>


                      {/* ================= RATING ================= */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center gap-2">

                          <Star
                            size={18}
                            className="shrink-0 fill-yellow-400 text-yellow-400"
                          />

                          <span className="font-bold text-gray-800">
                            {hotel.rating}
                          </span>

                        </div>

                      </td>


                      {/* ================= PRICE ================= */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center gap-1">

                          <IndianRupee
                            size={16}
                            className="shrink-0 text-gray-700"
                          />

                          <span className="whitespace-nowrap font-bold text-gray-800">
                            {hotel.price ?? "—"}
                          </span>

                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          per night
                        </p>

                      </td>


                      {/* ================= AMENITIES ================= */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex max-w-[220px] flex-wrap gap-2">

                          {(Array.isArray(hotel.amenities) ? hotel.amenities : String(hotel.amenities || "").split(",").filter(Boolean)).map((amenity, index) => (

                            <span
                              key={index}
                              className="whitespace-nowrap rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                            >
                              {amenity}
                            </span>

                          ))}

                        </div>

                      </td>


                      {/* ================= ACTIONS ================= */}
                      <td className="px-5 py-5 align-middle">

                        <div className="flex items-center gap-2">

                          {/* VIEW */}
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition hover:bg-blue-200"
                            title="View Hotel"
                          >
                            <Eye size={18} />
                          </motion.button>


                          {/* EDIT */}
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 transition hover:bg-yellow-200"
                            title="Edit Hotel"
                          >
                            <Edit size={18} />
                          </motion.button>


                          {/* DELETE */}
                          <motion.button
                            onClick={()=> deleteHotel(hotel._id)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 transition hover:bg-red-200"
                            title="Delete Hotel"
                          >
                            <Trash2 size={18} />
                          </motion.button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  /* ================= EMPTY STATE ================= */
                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">

                          <Eye
                            size={28}
                            className="text-blue-600"
                          />

                        </div>

                        <h3 className="text-xl font-bold text-gray-700">
                          No Hotels Found
                        </h3>

                        <p className="mt-2 text-gray-500">
                          No hotels are currently listed.
                        </p>

                        <button
                          onClick={() =>
                            navigate("/owner/registerhotel")
                          }
                          className="mt-5 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
                        >
                          Register Hotel
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

export default AllHotels;
