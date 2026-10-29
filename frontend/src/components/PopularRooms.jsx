import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import RoomCard from './RoomCard'

const PopularRooms = () => {

  const { rooms } = useContext(AppContext)

  return (
    <div className="py-16">

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          Popular Rooms
        </h1>

        <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-500">
          Explore our most popular rooms, each designed to provide a unique
          and memorable experience for our guests.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {(Array.isArray(rooms) ? rooms : []).map((room) => (
          <RoomCard
            key={room._id}
            room={room}
          />
        ))}

      </div>

    </div>
  )
}

export default PopularRooms