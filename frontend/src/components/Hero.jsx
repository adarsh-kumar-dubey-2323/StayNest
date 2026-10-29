import React from "react";
import { motion } from "motion/react";
import { assets, homePageData } from "../assets/assets.js";
import { cities } from "../assets/assets";
const Hero = () => {
  return (

    <>
    <main
      className="
        flex flex-col md:flex-row
        items-center justify-between
        gap-12
        mt-16 pb-16
        px-6 sm:px-10 md:px-24
        max-w-7xl mx-auto w-full
      "
    >
      {/* LEFT CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 max-md:text-center"
      >
        {/* HEADING */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl
            font-bold
            leading-tight
            tracking-tight
            text-gray-900
          "
        >
          Forget Busy Work <br />

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: "easeOut",
            }}
            className="text-gray-500 inline-block"
          >
            Start Next Vacation
          </motion.span>
        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.5,
            ease: "easeOut",
          }}
          className="
            mt-6
            max-w-xl
            text-base sm:text-lg
            leading-relaxed
            text-gray-600
          "
        >
          We provide what you need to enjoy your holiday with family.
          Time to make another memorable moment.
        </motion.p>

        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="
            group
            mt-6
            px-7 py-3.5
            flex items-center gap-3
            bg-blue-700
            text-white
            rounded-full
            font-semibold
            shadow-lg
            hover:shadow-xl
            transition-all duration-300
            max-md:mx-auto
          "
        >
          Show More

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </motion.button>

        {/* STATS */}
        <div className="flex flex-wrap gap-8 mt-10 max-md:justify-center">
          {homePageData.map((item, index) => (
            <motion.div
              key={index}
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-12 h-12 mb-2"
              />

              <p className="text-2xl font-bold text-gray-900">
                {item.value}+
              </p>

              <h2 className="text-sm text-gray-500 capitalize">
                {item.title}
              </h2>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* RIGHT IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: 80, scale: 0.95 }}
  animate={{
    opacity: 1,
    x: 0,
    scale: 1,
    y: [0, -15, 0],
  }}
  transition={{
    opacity: { duration: 0.8, ease: "easeOut" },
    x: { duration: 0.8, ease: "easeOut" },
    scale: { duration: 0.8, ease: "easeOut" },
    y: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }}
        className="w-full md:w-1/2 flex justify-center md:justify-end items-center"
>
         <motion.img
    src={assets.hero_img}
    alt="Vacation destination"
    className="w-full max-w-md lg:max-w-xl h-auto object-cover rounded-3xl"
  />
      </motion.div>
    </main>

    {/* Form to search a hotel */}


 <form
  className="
    bg-blue-50 text-gray-500 rounded-lg
    px-6 py-4
    flex flex-col md:flex-row
    justify-center
    items-start md:items-center
    gap-4
    max-md:mx-auto
  "
>
  {/* LOCATION */}
  <div>
    <div className="flex items-center gap-2">
      <img
        src={assets.location_icon}
        alt=""
        className="w-4 h-4"
      />

      <label htmlFor="destinationInput">
        Select Location
      </label>
    </div>

    <input
      list="destinations"
      id="destinationInput"
      type="text"
      className="
        rounded border border-gray-200
        px-3 py-1.5 mt-1.5
        text-sm outline-none
        focus:ring-2 focus:ring-blue-300
      "
      placeholder="Type here"
      required
    />

    <datalist id="destinations">
      {cities.map((city, index) => (
        <option key={index} value={city} />
      ))}
    </datalist>
  </div>

  {/* CHECK IN */}
  <div>
    <div className="flex items-center gap-2">
      <img
        src={assets.calendar_icon}
        alt=""
        className="w-4 h-4"
      />

      <label htmlFor="checkIn">
        Check in
      </label>
    </div>

    <input
      id="checkIn"
      type="date"
      className="
        rounded border border-gray-200
        px-3 py-1.5 mt-1.5
        text-sm outline-none
        focus:ring-2 focus:ring-blue-300
      "
    />
  </div>

  {/* CHECK OUT */}
  <div>
    <div className="flex items-center gap-2">
      <img
        src={assets.calendar_icon}
        alt=""
        className="w-4 h-4"
      />

      <label htmlFor="checkOut">
        Check out
      </label>
    </div>

    <input
      id="checkOut"
      type="date"
      className="
        rounded border border-gray-200
        px-3 py-1.5 mt-1.5
        text-sm outline-none
        focus:ring-2 focus:ring-blue-300
      "
    />
  </div>

  {/* GUESTS */}
  <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
    <label htmlFor="guests">
      Guests
    </label>

    <input
      min={1}
      max={4}
      id="guests"
      type="number"
      className="
        rounded border border-gray-200
        px-3 py-1.5 mt-1.5
        text-sm outline-none
        max-w-16
      "
      placeholder="0"
    />
  </div>

  {/* SEARCH */}
  <button
    type="submit"
    className="
      flex items-center justify-center
      gap-1
      rounded-md
      bg-primary
      py-3 px-4
      text-white
      my-auto
      cursor-pointer
      hover:bg-gray-800
      transition-colors
      max-md:w-full
      max-md:py-2
    "
  >
    {/* <svg
      className="w-4 h-4"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
      />
    </svg> */}

    <span>Search</span>
  </button>
</form>






    </>
  );
};

export default Hero;