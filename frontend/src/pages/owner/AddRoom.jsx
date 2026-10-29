import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, UploadCloud, X } from "lucide-react";

const initialForm = {
  hotel: "",
  roomType: "Standard",
  pricePerNight: "",
  description: "",
  amenities: [],
  isAvailable: true,
};

const amenityOptions = [
  "Free WiFi",
  "Air Conditioning",
  "TV",
  "Breakfast",
  "Bathtub",
  "Swimming Pool",
  "Parking",
  "Mountain View",
  "Room Service",
  "Mini Bar",
];

const AddRoom = () => {
  const { axios, hotels, fetchHotels, fetchRooms } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!Array.isArray(hotels) || hotels.length === 0) fetchHotels?.();
  }, [hotels, fetchHotels]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleAmenity = (amenity) => {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }));
  };

  const handleImages = (event) => {
    const selected = Array.from(event.target.files || []);
    if (selected.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Please select image files only.");
      event.target.value = "";
      return;
    }
    setImages((current) => [...current, ...selected].slice(0, 5));
    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.hotel || !form.roomType || !form.pricePerNight || !form.description.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (Number(form.pricePerNight) < 0) {
      toast.error("Price cannot be negative.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one room image.");
      return;
    }

    const payload = new FormData();
    payload.append("hotel", form.hotel);
    payload.append("roomType", form.roomType);
    payload.append("pricePerNight", String(Number(form.pricePerNight)));
    payload.append("description", form.description.trim());
    payload.append("isAvailable", String(form.isAvailable));
    payload.append("amenities", JSON.stringify(form.amenities));
    images.forEach((file) => payload.append("image", file));

    try {
      setSubmitting(true);
      const { data } = await axios.post("/api/room/add", payload);
      if (!data.success) {
        toast.error(data.message || "Unable to add room.");
        return;
      }
      toast.success(data.message || "Room added successfully.");
      setForm(initialForm);
      setImages([]);
      await Promise.all([fetchRooms?.(), fetchHotels?.()]);
      navigate("/owner/allroom");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to add room.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <button type="button" onClick={() => navigate("/owner/allroom")} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft size={18} /> Back to rooms
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Add a room</h1>
        <p className="mt-1 text-sm text-slate-500">Add room details and upload real image files.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="hotel" className="mb-1 block text-sm font-medium text-slate-700">Hotel *</label>
            <select id="hotel" name="hotel" value={form.hotel} onChange={updateField} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5">
              <option value="">Select your hotel</option>
              {(hotels || []).map((hotel) => (
                <option key={hotel._id} value={hotel._id}>{hotel.hotelName || hotel.name || "Unnamed hotel"}</option>
              ))}
            </select>
            {(!hotels || hotels.length === 0) && <p className="mt-1 text-xs text-amber-700">No hotels found. Register a hotel first.</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="roomType" className="mb-1 block text-sm font-medium text-slate-700">Room type *</label>
              <select id="roomType" name="roomType" value={form.roomType} onChange={updateField} className="w-full rounded-lg border border-slate-300 px-3 py-2.5">
                {["Standard", "Deluxe", "Premium", "Suite", "Executive", "Family", "Presidential"].map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="pricePerNight" className="mb-1 block text-sm font-medium text-slate-700">Price per night (₹) *</label>
              <input id="pricePerNight" name="pricePerNight" type="number" min="0" step="0.01" value={form.pricePerNight} onChange={updateField} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">Description *</label>
            <textarea id="description" name="description" rows="4" value={form.description} onChange={updateField} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5" placeholder="Describe the room, view, and facilities." />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-700">Amenities</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {amenityOptions.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-sm">
                  <input type="checkbox" checked={form.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                  {amenity}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="images" className="mb-2 block text-sm font-medium text-slate-700">Room images * (up to 5)</label>
            <label htmlFor="images" className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-blue-500">
              <UploadCloud className="mb-2 text-slate-500" size={28} />
              <span className="text-sm font-medium text-slate-700">Choose image files</span>
              <span className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP</span>
            </label>
            <input id="images" type="file" accept="image/*" multiple onChange={handleImages} className="sr-only" />
            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previews.map((src, index) => (
                  <div key={`${src}-${index}`} className="relative">
                    <img src={src} alt={`Room preview ${index + 1}`} className="h-32 w-full rounded-lg object-cover" />
                    <button type="button" onClick={() => removeImage(index)} aria-label="Remove image" className="absolute right-2 top-2 rounded-full bg-white p-1 text-slate-700 shadow"><X size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={updateField} />
            Available for booking
          </label>

          <button type="submit" disabled={submitting || !hotels?.length} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Saving room..." : "Add room"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
