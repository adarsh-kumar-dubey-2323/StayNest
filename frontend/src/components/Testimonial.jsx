import React from 'react'
import { motion } from 'framer-motion'

const StarRating = () => (
  <div className="flex items-center justify-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className="h-4 w-4 fill-amber-400 text-amber-400"
        viewBox="0 0 22 20"
      >
        <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" />
      </svg>
    ))}
  </div>
)

const testimonials = [
  {
    name: 'Donald Jackman',
    role: 'Content Creator',
    image:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    review:
      'I have been using this platform for nearly two years and it has made my travel planning incredibly simple. The experience has been smooth, reliable, and user-friendly.',
  },
  {
    name: 'Richard Nelson',
    role: 'Instagram Influencer',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    review:
      'The entire booking experience was incredibly smooth. The rooms were comfortable, the location was excellent, and everything felt well organized.',
  },
  {
    name: 'James Washington',
    role: 'Marketing Manager',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
    review:
      'From booking to checkout, everything was simple and convenient. The service was excellent and the overall stay was comfortable and enjoyable.',
  },
]

const Testimonial = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white px-4 py-20 sm:px-6 lg:px-8">

      {/* Decorative background */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />

      {/* Section Header */}
      <div className="relative mx-auto mb-16 max-w-3xl text-center">

        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-blue-600" />

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
            Guest Reviews
          </span>

          <span className="h-px w-10 bg-blue-600" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          What Our Guests Say
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base lg:text-lg">
          Discover why travelers love staying with us. Hear from guests who
          enjoyed exceptional comfort, service, and memorable experiences.
        </p>

      </div>

      {/* Testimonials */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">

        {testimonials.map((testimonial, index) => (
        
<motion.div
  key={testimonial.name}
  animate={{
    y: [0, -12, 0, 12, 0],
    rotate: [0, 0.5, 0, -0.5, 0],
  }}
  transition={{
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    delay: index * 0.7,
  }}
  whileHover={{
    scale: 1.03,
  }}
  className="group relative rounded-3xl border border-gray-100 bg-white px-6 pb-7 pt-14 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
>


            {/* Avatar */}
            <div className="absolute -top-11 left-1/2 -translate-x-1/2">

              <div className="rounded-full bg-white p-1.5 shadow-lg">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-50"
                />
              </div>

            </div>

            {/* User Info */}
            <div className="text-center">

              <h3 className="text-lg font-semibold text-gray-900">
                {testimonial.name}
              </h3>

              <p className="mt-1 text-sm font-medium text-blue-600">
                {testimonial.role}
              </p>

            </div>

            {/* Quote */}
            <div className="mt-6">

              <span className="block text-center text-4xl font-serif leading-none text-blue-100">
                “
              </span>

              <p className="mt-1 text-center text-sm leading-7 text-gray-500">
                {testimonial.review}
              </p>

            </div>

            {/* Rating */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <StarRating />
            </div>

          </motion.div>
        ))}

      </div>

    </section>
  )
}

export default Testimonial
