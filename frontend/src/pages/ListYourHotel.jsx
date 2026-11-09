import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const ListYourHotel = () => {
  const { user, owner, axios, authLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ hotelName: "", phone: "", hotelAddress: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login", { state: { from: "/list-your-hotel" }, replace: true });
  }, [authLoading, user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const { data } = await axios.post("/api/owner-applications", form);
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else toast.error(data.message || "Application could not be submitted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center text-gray-500">Checking your account...</div>;
  if (owner?.role === "owner") return <div className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="text-2xl font-bold">You are already an approved hotel owner.</h1><Link className="mt-4 inline-block text-indigo-600 underline" to="/owner">Open owner dashboard</Link></div>;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <form onSubmit={submit} className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 shadow-sm sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">StayNest partner program</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">List your hotel</h1>
        <p className="mt-2 mb-8 text-gray-600">Submit your property details. Our admin will review the application and approve eligible hotel-owner accounts.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Applicant name<input readOnly value={user.name} className="mt-2 w-full rounded-xl border bg-gray-100 px-4 py-3 text-gray-500" /></label>
          <label className="text-sm font-medium text-gray-700">Account email<input readOnly value={user.email} className="mt-2 w-full rounded-xl border bg-gray-100 px-4 py-3 text-gray-500" /></label>
          <label className="text-sm font-medium text-gray-700 sm:col-span-2">Hotel / property name<input required minLength={3} maxLength={100} value={form.hotelName} onChange={(e) => setForm({ ...form, hotelName: e.target.value })} placeholder="e.g. StayNest Residency" className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500" /></label>
          <label className="text-sm font-medium text-gray-700 sm:col-span-2">Contact number<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Your business contact number" className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500" /></label>
          <label className="text-sm font-medium text-gray-700 sm:col-span-2">Complete hotel address<textarea required minLength={5} rows={3} value={form.hotelAddress} onChange={(e) => setForm({ ...form, hotelAddress: e.target.value })} placeholder="Property address, city, state" className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500" /></label>
          <label className="text-sm font-medium text-gray-700 sm:col-span-2">Additional details (optional)<textarea rows={3} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your property or business." className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500" /></label>
        </div>
        <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Your account remains a regular user until the application is approved. Approval unlocks the owner dashboard.</div>
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? "Submitting..." : "Submit owner application"}</button>
      </form>
    </main>
  );
};

export default ListYourHotel;
