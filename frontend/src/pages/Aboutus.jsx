import React from "react";
import { Link } from "react-router-dom";
import {
  Hotel,
  MapPin,
  ShieldCheck,
  Headphones,
  Star,
  Users,
  BedDouble,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: Hotel,
      title: "Quality Hotels",
      description:
        "We partner with trusted hotels and properties to provide comfortable and memorable stays.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Booking",
      description:
        "Your booking information is handled securely so you can reserve your stay with confidence.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Our support team is here to help you with your booking and travel-related questions.",
    },
    {
      icon: Star,
      title: "Best Experience",
      description:
        "We make it easier to discover rooms that match your preferences, budget, and travel plans.",
    },
  ];

  const stats = [
    {
      icon: Hotel,
      number: "500+",
      label: "Hotels",
    },
    {
      icon: BedDouble,
      number: "10K+",
      label: "Rooms",
    },
    {
      icon: Users,
      number: "50K+",
      label: "Happy Guests",
    },
    {
      icon: Award,
      number: "4.8/5",
      label: "Guest Rating",
    },
  ];

  const values = [
    "Comfortable and reliable accommodation",
    "Transparent and simple booking experience",
    "Trusted hotel partners",
    "Customer-first support",
    "Quality stays at competitive prices",
    "A seamless experience from booking to check-in",
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-zinc-950 text-white">
        {/* Background Glow */}
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-zinc-400">
            <Link
              to="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <span className="text-white">
              About Us
            </span>
          </div>

          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              <Hotel size={16} />
              About LankaStay
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              Your journey begins with
              <span className="block text-blue-400">
                the right stay.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              StayNest is a modern hotel booking platform designed to make
              finding and booking the perfect stay simple, convenient, and
              stress-free.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/hotel"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Explore Hotels
                <ArrowRight size={17} />
              </Link>

              {/* <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Us
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-zinc-200 sm:grid-cols-4 px-6 sm:px-8 lg:px-10">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center px-5 py-10 text-center"
              >
                <Icon
                  size={24}
                  className="mb-3 text-blue-600"
                />

                <p className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                  {stat.number}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {stat.label}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* =====================================================
          OUR STORY
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 sm:px-8 lg:grid-cols-2 lg:px-10">

          {/* Image */}
          <div className="relative">
            <div className="absolute -bottom-5 -right-5 h-full w-full rounded-3xl bg-blue-100" />

            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop"
              alt="Luxury hotel"
              className="relative h-[420px] w-full rounded-3xl object-cover shadow-xl sm:h-[500px]"
            />

            {/* Floating Card */}
            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/20 bg-white/95 p-5 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Star
                    size={20}
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p className="text-lg font-bold">
                    4.8/5
                  </p>

                  <p className="text-xs text-zinc-500">
                    Guest Satisfaction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Our Story
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Making hotel booking
              <span className="block">
                simple and enjoyable.
              </span>
            </h2>

            <p className="mt-6 text-base leading-8 text-zinc-600">
              Finding the right place to stay should be one of the easiest
              parts of your journey. That's why StayNest was created to
              bring hotels, rooms, and travelers together through a simple
              and convenient booking experience.
            </p>

            <p className="mt-5 text-base leading-8 text-zinc-600">
              Whether you're planning a business trip, a family vacation,
              a weekend getaway, or a long stay, our goal is to help you
              discover accommodation that fits your needs.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {values.slice(0, 4).map((value) => (
                <div
                  key={value}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <span className="text-sm leading-6 text-zinc-700">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}

      <section className="bg-zinc-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Why LankaStay
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Everything you need for a better stay
            </h2>

            <p className="mt-5 text-base leading-7 text-zinc-600">
              We focus on making every step of your hotel booking journey
              simple, reliable, and comfortable.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-zinc-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-zinc-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =====================================================
          OUR VALUES
      ====================================================== */}

      <section className="bg-zinc-950 py-20 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 sm:px-8 lg:grid-cols-2 lg:px-10">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Our Values
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Built around what matters
              <span className="block text-zinc-400">
                to our guests.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">
              We believe a great hotel experience starts long before
              check-in. From discovering the right property to completing
              your booking, every interaction should feel easy and
              trustworthy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => (
              <div
                key={value}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-semibold text-blue-400">
                  {index + 1}
                </div>

                <p className="text-sm leading-6 text-zinc-300">
                  {value}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">

          <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-7 py-14 text-center text-white sm:px-12">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

            <div className="relative">
              <MapPin
                size={30}
                className="mx-auto mb-5"
              />

              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to find your next stay?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                Explore our collection of hotels and rooms and start
                planning your next memorable journey.
              </p>

              <Link
                to="/hotel"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Explore Hotels
                <ArrowRight size={17} />
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutUs;
