import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const RoomCard = ({ room }) => {

  const { navigate } = useContext(AppContext)

  return (
    <div className="group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      <img
        className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
        src={(Array.isArray(room.images) ? room.images[0] : room.images) ? (String(Array.isArray(room.images) ? room.images[0] : room.images).startsWith("http") ? (Array.isArray(room.images) ? room.images[0] : room.images) : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/images/${Array.isArray(room.images) ? room.images[0] : room.images}`) : ""}
        alt={room.roomType || "Room"}
      />

      <div className="p-5">

        <p className="text-xl font-semibold text-gray-900">
          {room.roomType}
        </p>

        {/* <p className="text-sm leading-6 text-gray-500 mt-2 line-clamp-2">
          {room.description}
        </p> */}

        <div className="flex items-center justify-between mt-5">

          <div>
            <p className="text-lg font-bold text-gray-900">
              ₹{room.pricePerNight}
              <span className="text-sm font-normal text-gray-500">
                {' '} / night
              </span>
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {room.capacity} Guests
            </p>
          </div>

          <button
            onClick={() => {
              navigate(`/rooms/${room._id}`)
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            See Details
          </button>

        </div>

      </div>
    </div>
  )
}

export default RoomCard