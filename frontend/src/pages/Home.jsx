import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from "../components/Hero"
import MostPicked from '../components/MostPicked'
import PopularRooms from '../components/PopularRooms'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <div className="py-24">
      <Hero/>
      <MostPicked/>
      <PopularRooms/>
      <Testimonial/>
      <Newsletter/>
    </div>
  )
}

export default Home