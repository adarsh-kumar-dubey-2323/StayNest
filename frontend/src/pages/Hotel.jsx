import React from 'react'
import { motion } from 'framer-motion'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Hotel = () => {
  const { hotels } = useContext(AppContext)
  return (
    <div className="mx-auto max-w-7xl px-4 py-24">
      <h1 className="text-3xl font-semibold text-heading my-8 px-2">
        All Hotels
      </h1>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {hotels?.map((items, index) => (
          <motion.div
            key={items._id || index}
            className="relative group overflow-hidden rounded-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity
            }}
          >

            <img
              src={items.image?.startsWith("http") ? items.image : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/images/${items.image || ""}`}
              alt={items.hotelName}
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
                ₹{items.price}
              </p>

            </div>

          </motion.div>
        ))}

      </div>
    </div>
  )
}

export default Hotel