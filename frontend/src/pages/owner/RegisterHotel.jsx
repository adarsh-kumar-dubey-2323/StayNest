
import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Star,
  Wifi,
  Waves,
  Dumbbell,
  Utensils,
  Check,
  X,
  Car,
  Wind,
  Sparkles,
  Shirt,
  Plane,
  Briefcase,
  PawPrint,
} from "lucide-react";

// These values must match hotel.model.js
const AMENITIES = [
  { name: "Free WiFi", icon: Wifi },
  { name: "Swimming Pool", icon: Waves },
  { name: "Parking", icon: Car },
  { name: "Restaurant", icon: Utensils },
  { name: "Room Service", icon: Briefcase },
  { name: "Air Conditioning", icon: Wind },
  { name: "Gym", icon: Dumbbell },
  { name: "Spa", icon: Sparkles },
  { name: "Airport Shuttle", icon: Plane },
  { name: "Laundry", icon: Shirt },
  { name: "Conference Room", icon: Briefcase },
  { name: "Pet Friendly", icon: PawPrint },
];

const initialForm = {
  hotelName: "",
  hotelAddress: "",
  price: "",
  rating: "3",
};

export default function RegisterHotel() {
  const { axios } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5 MB or less.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  // Toggle amenities
  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  // Register hotel
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!axios) {
      toast.error("Axios is not configured in AppContext.");
      return;
    }

    if (
      !formData.hotelName.trim() ||
      !formData.hotelAddress.trim() ||
      formData.price === ""
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.rating)) ||
      Number(formData.rating) < 1 ||
      Number(formData.rating) > 5
    ) {
      toast.error("Rating must be between 1 and 5.");
      return;
    }

    if (!imageFile) {
      toast.error("Please select a hotel image.");
      return;
    }

    if (selectedAmenities.length === 0) {
      toast.error("Please select at least one amenity.");
      return;
    }

    // Send multipart form data because the image is a file
    const payload = new FormData();

    payload.append("hotelName", formData.hotelName.trim());
    payload.append("hotelAddress", formData.hotelAddress.trim());
    payload.append("price", String(Number(formData.price)));
    payload.append("rating", String(Number(formData.rating)));
    payload.append("image", imageFile);

    // Backend schema expects an array of strings
    selectedAmenities.forEach((amenity) => {
      payload.append("amenities", amenity);
    });

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/hotel/register",
        payload
      );

      if (!data?.success) {
        toast.error(data?.message || "Hotel registration failed.");
        return;
      }

      toast.success(
        data.message || "Hotel registered successfully!"
      );

      setFormData(initialForm);
      setImageFile(null);
      setSelectedAmenities([]);

      navigate("/owner/allhotels");
    } catch (error) {
      console.error("Hotel registration error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to register hotel."
      );
    } finally {
      setLoading(false);
    }
  };

  const imagePreview = imageFile
    ? URL.createObjectURL(imageFile)
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <header className="mb-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-xl">
          <button
            type="button"
            onClick={() => navigate("/owner/allhotels")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              Register Hotel
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add a new hotel to your collection
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Hotel Information */}
          <section className="rounded-2xl bg-white p-5 shadow-xl sm:p-7">
            <h2 className="mb-1 text-xl font-bold text-gray-800">
              Hotel Information
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Enter the basic information about your hotel.
            </p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Hotel Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Hotel Name *
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    required
                    minLength={3}
                    maxLength={100}
                    type="text"
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleChange}
                    placeholder="Enter hotel name"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Price Per Night (₹) *
                </label>

                <div className="relative">
                  <DollarSign
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    required
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2500"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Rating (1–5) *
                </label>

                <div className="relative">
                  <Star
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400"
                  />

                  <input
                    required
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Hotel Image *
                </label>

                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Select an image up to 5 MB.
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Hotel Address *
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-4 text-gray-400"
                />

                <textarea
                  required
                  minLength={5}
                  name="hotelAddress"
                  value={formData.hotelAddress}
                  onChange={handleChange}
                  placeholder="Enter complete hotel address"
                  rows={3}
                  className={`${inputClass} resize-none pl-10`}
                />
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="rounded-2xl bg-white p-5 shadow-xl sm:p-7">
            <h2 className="mb-1 text-xl font-bold text-gray-800">
              Hotel Amenities
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Select all amenities available at your hotel.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {AMENITIES.map(({ name, icon: Icon }) => {
                const selected = selectedAmenities.includes(name);

                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleAmenity(name)}
                    className={`flex min-h-[52px] items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-500"
                      }`}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="flex-1 text-sm font-medium">
                      {name}
                    </span>

                    {selected && <Check size={17} />}
                  </button>
                );
              })}
            </div>

            {/* Selected Amenities */}
            {selectedAmenities.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Selected Amenities
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedAmenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700"
                    >
                      {amenity}

                      <button
                        type="button"
                        aria-label={`Remove ${amenity}`}
                        onClick={() => toggleAmenity(amenity)}
                        className="rounded-full hover:bg-blue-200"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Image Preview */}
          {imagePreview && (
            <section className="rounded-2xl bg-white p-5 shadow-xl sm:p-7">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Image Preview
              </h2>

              <img
                src={imagePreview}
                alt="Hotel preview"
                className="h-64 w-full rounded-xl object-cover sm:h-80"
              />
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 rounded-2xl bg-white p-5 shadow-xl sm:flex-row sm:justify-end sm:p-6">
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/owner/allhotels")}
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register Hotel"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";
