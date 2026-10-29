import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'

const MostPicked = () => {

  const { hotels } = useContext(AppContext)

  return (
    <div>
      <div className="mb-12">
  <div className="flex items-center gap-3 mb-3">
    <span className="h-px w-10 bg-blue-600"></span>
    <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
      Featured Stays
    </span>
  </div>

  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
    Most Picked Hotels
  </h1>

  <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-500">
    Discover handpicked hotels offering exceptional comfort, great
    locations, and memorable stays for every kind of traveler.
  </p>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {(Array.isArray(hotels) ? hotels : []).map((items) => (
          <motion.div
            key={items._id}
            className="relative group overflow-hidden rounded-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity
            }}
          >

            <img
              src={items.image ? (String(items.image).startsWith("http") ? items.image : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/images/${items.image}`) : ""}
              alt={items.hotelName || "Hotel"}
              className="w-full h-56 object-cover object-top"
            />

            <div
              className="absolute inset-0 flex flex-col justify-end text-white p-4
              bg-black/50 opacity-0 group-hover:opacity-100
              transition-all duration-300"
            >

              <h1 className="text-lg font-medium">
                {items.hotelName}
              </h1>

              <p className="text-sm">
                {items.hotelAddress}
              </p>

              <p className="text-lg font-bold">
                ${items.pricePerNight ?? items.price ?? "—"}
              </p>

            </div>

          </motion.div>
        ))}

      </div>
    </div>
  )
}

export default MostPicked