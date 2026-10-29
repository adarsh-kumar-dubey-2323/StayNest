import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const links = [
    {
      title: "Explore",
      items: [
        "Hotels",
        "Rooms",
        "Popular Destinations",
        "Special Offers",
      ],
    },
    {
      title: "Company",
      items: [
        "About Us",
        "Contact Us",
        "Careers",
        "Our Partners",
      ],
    },
    {
      title: "Guest Services",
      items: [
        "My Bookings",
        "Help Center",
        "Cancellation Policy",
        "FAQs",
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-white">
      {/* Background Glow */}
      <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">

        {/* =====================================================
            TOP SECTION
        ====================================================== */}

        <div className="grid gap-14 border-b border-white/10 pb-14 lg:grid-cols-[1.5fr_2fr]">

          {/* BRAND */}

          <div className="max-w-md">
            <Link
              to="/"
              className="mb-6 flex items-center gap-3"
            >
              {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <svg
                  width="25"
                  height="27"
                  viewBox="0 0 27 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m7.25 4.11 6 3.366 6-3.367m-12 20.176v-6.721l-6-3.367m24 0-6 3.367v6.72M1.61 7.67l11.64 6.54 11.64-6.54M13.25 27.25V14.197m12 5.18V9.017c0-.454-.124-.9-.358-1.293a2.63 2.63 0 0 0-.975-.947l-9.333-5.18a2.73 2.73 0 0 0-2.667 0l-9.333 5.18a2.63 2.63 0 0 0-.976.947 2.54 2.54 0 0 0-.358 1.293v10.36c0 .454.124.9.358 1.293s.57.72.976.947l9.333 5.18a2.73 2.73 0 0 0 2.667 0l9.333-5.18a2.63 2.63 0 0 0 .975-.947 2.53 2.53 0 0 0 .358-1.293"
                    stroke="#000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div> */}

              <span className="text-xl font-semibold tracking-tight">
                StayNest
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-zinc-400">
              Find and book comfortable hotels and rooms at the best
              destinations. Enjoy a seamless booking experience from
              discovery to check-in.
            </p>

            {/* SOCIAL LINKS */}
            <div className="mt-7 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white hover:text-black"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white hover:text-black"
              >
                ig
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white hover:text-black"
              >
                X
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white hover:text-black"
              >
                ▶
              </a>
            </div>
          </div>

          {/* IMPORTANT: Brand div closed above */}

          {/* FOOTER LINKS */}

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {links.map((link) => (
              <div key={link.title}>
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
                  {link.title}
                </h3>

                <ul className="space-y-4">
                  {link.items.map((item) => (
                    <li key={item}>
                      <Link
                        to="#"
                        className="text-sm text-zinc-400 transition-colors hover:text-white"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            CONTACT + NEWSLETTER
        ====================================================== */}

        <div className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-2">

          {/* CONTACT */}

          <div>
            <h3 className="mb-6 text-lg font-semibold">
              Get in touch
            </h3>

            <div className="grid gap-5 sm:grid-cols-3">

              {/* ADDRESS */}

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <MapPin size={16} />
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-white">
                    Address
                  </p>

                  <p className="text-xs leading-5 text-zinc-500">
                    123 Royal Street
                    <br />
                    New Delhi, India
                  </p>
                </div>
              </div>

              {/* PHONE */}

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Phone size={16} />
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-white">
                    Phone
                  </p>

                  <p className="text-xs text-zinc-500">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              {/* EMAIL */}

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Mail size={16} />
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-white">
                    Email
                  </p>

                  <p className="text-xs text-zinc-500">
                    support@staynest.com
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* NEWSLETTER */}

          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Get exclusive hotel deals
            </h3>

            <p className="mb-5 text-sm text-zinc-500">
              Subscribe to receive special offers, travel inspiration,
              and the latest hotel deals directly in your inbox.
            </p>

            <div className="flex max-w-md rounded-xl border border-white/10 bg-white/5 p-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />

              <button
                type="button"
                className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div className="flex flex-col gap-5 pt-7 md:flex-row md:items-center md:justify-between">

          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Staynest. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-7 gap-y-3">

            <Link
              to="#"
              className="text-xs text-zinc-500 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="#"
              className="text-xs text-zinc-500 transition-colors hover:text-white"
            >
              Terms & Conditions
            </Link>

            <Link
              to="/about"
              className="text-xs text-zinc-500 transition-colors hover:text-white"
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="text-xs text-zinc-500 transition-colors hover:text-white"
            >
              Contact
            </Link>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
