import React, { useContext, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOwnerSignup = searchParams.get("type") === "owner";
  const { axios } = useContext(AppContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const { data } = await axios.post("/api/user/signup", { ...formData, accountType: isOwnerSignup ? "owner" : "user" });
      toast.success(data.message || "Account created successfully.");
      if (data.ownerApplicationAccount) {
        navigate("/login", { replace: true, state: { ownerSignup: true } });
      } else {
        navigate("/verify-email?email=" + encodeURIComponent(formData.email.trim()), { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to register. Please try again.");
      if (error.response?.data?.accountCreated) {
        navigate("/verify-email?email=" + encodeURIComponent(formData.email.trim()), { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-89px)] flex items-center justify-center bg-gray-50 px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">{isOwnerSignup ? "Create Hotel Owner Account" : "Create Account"}</h1>
          <p className="mt-2 text-sm text-gray-500">{isOwnerSignup ? "Create an account and submit your property for admin approval. Email-link verification is not required for owner applicants." : "Join StayNest and book your next stay."}</p>
        </div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
        <input id="name" type="text" name="name" placeholder="Enter your full name" autoComplete="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mb-4 h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
        <input id="email" type="email" name="email" placeholder="Enter your email" autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="mb-4 h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
        <div className="mb-2 flex h-12 items-center rounded-xl border border-gray-300 px-4 focus-within:border-indigo-500">
          <input id="password" type={showPassword ? "text" : "password"} name="password" placeholder="Create a password" autoComplete="new-password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} minLength={8} required className="w-full outline-none" />
          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="ml-2 text-sm text-indigo-600">{showPassword ? "Hide" : "Show"}</button>
        </div>
        <p className="mb-5 text-xs text-gray-500">Password must contain at least 8 characters.</p>
        <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-indigo-500 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating account..." : "Create Account"}</button>
        <p className="mt-6 text-center text-sm text-gray-500">Already have an account?<Link to="/login" className="ml-1 font-medium text-indigo-600 hover:underline">Login</Link></p>
        <p className="mt-4 text-center text-sm text-gray-500">Want to list your property?<Link to="/signup?type=owner" className="ml-1 font-medium text-indigo-600 hover:underline">Create owner account</Link></p>
      </form>
    </div>
  );
};

export default Signup;
