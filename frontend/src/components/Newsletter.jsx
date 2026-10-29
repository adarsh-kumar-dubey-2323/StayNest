import React from 'react'

const Newsletter = () => {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      
      {/* Main Newsletter Card */}
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:px-10 lg:px-16">

        {/* Decorative Circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />

        {/* Content */}
        <div className="relative mx-auto max-w-3xl text-center">

          {/* Badge */}
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 shadow-sm">
            Stay Updated
          </span>

          {/* Heading */}
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Subscribe to Our
            <span className="text-blue-600"> Newsletter</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Get exclusive travel tips, special offers, hotel updates, and
            inspiring destinations delivered straight to your inbox.
          </p>

          {/* Email Form */}
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-lg shadow-blue-100/50 sm:flex-row sm:rounded-full">

            <input
              type="email"
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:rounded-full"
            />

            <button
              type="button"
              className="rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg active:scale-95 sm:rounded-full"
            >
              Subscribe
            </button>

          </div>

          {/* Small Privacy Text */}
          <p className="mt-4 text-xs text-gray-400">
            No spam. Unsubscribe anytime.
          </p>

        </div>

        {/* Benefits */}
        <div className="relative mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 border-t border-gray-200/70 pt-10 sm:grid-cols-3">

          {/* Benefit 1 */}
          <div className="group rounded-2xl bg-white/70 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.834 20.167H9.167c-3.457 0-5.186 0-6.26-1.074s-1.074-2.802-1.074-6.26V11c0-3.457 0-5.185 1.074-6.26 1.074-1.073 2.803-1.073 6.26-1.073h3.667c3.456 0 5.185 0 6.259 1.074s1.074 2.802 1.074 6.26v1.833c0 3.457 0 5.185-1.074 6.259-.599.599-1.401.864-2.593.981M6.417 3.667V2.292m9.167 1.375V2.292m4.125 5.958H9.854m-8.02 0h3.552"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-gray-800">
              Weekly Articles
            </h3>

            <p className="mt-2 text-xs leading-6 text-gray-500">
              Helpful travel guides, tips, and destination inspiration.
            </p>

          </div>

          {/* Benefit 2 */}
          <div className="group rounded-2xl bg-white/70 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.834 3.208v6.875-5.958a1.375 1.375 0 1 1 2.75 0v5.958-3.208a1.375 1.375 0 1 1 2.75 0v7.791a5.5 5.5 0 0 1-5.5 5.5H11.8a5.5 5.5 0 0 1-3.76-1.486l-4.546-4.261a1.594 1.594 0 1 1 2.218-2.291l1.623 1.623V5.958a1.375 1.375 0 1 1 2.75 0v4.125-6.875a1.375 1.375 0 1 1 2.75 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-gray-800">
              No Spam
            </h3>

            <p className="mt-2 text-xs leading-6 text-gray-500">
              Only useful content and updates. Your inbox stays clean.
            </p>

          </div>

          {/* Benefit 3 */}
          <div className="group rounded-2xl bg-white/70 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3v18M3 12h18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-gray-800">
              Exclusive Offers
            </h3>

            <p className="mt-2 text-xs leading-6 text-gray-500">
              Be the first to know about special deals and offers.
            </p>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Newsletter

