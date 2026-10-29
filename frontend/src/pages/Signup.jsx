
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { axios } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  try {
    setLoading(true);

    const { data } = await axios.post(
      "/api/user/signup",
      formData
    );

    console.log("Signup response:", data);

    if (data.success) {
      toast.success(
        data.message || "Account created successfully!"
      );

      if (formData.role === "owner") {
        navigate("/login", { replace: true });
        toast("Please log in with your owner account.");
      } else {
        navigate("/login", { replace: true });
      }
    } else {
      toast.error(data.message || "Signup failed");
    }
  } catch (error) {
    console.error("Signup error:", error);

    toast.error(
      error.response?.data?.message ||
        "Unable to register. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-[calc(100vh-89px)] flex items-center justify-center bg-gray-50 px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-lg"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join us and get started today
          </p>
        </div>

        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mb-4 h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-4 h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Account Type
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="mb-4 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 outline-none focus:border-indigo-500"
        >
          <option value="" disabled>
            Select account type
          </option>
          <option value="user">User</option>
          <option value="owner">Hotel Owner</option>
        </select>

        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <div className="mb-2 flex h-12 items-center rounded-xl border border-gray-300 px-4 focus-within:border-indigo-500">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
            className="w-full outline-none"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="ml-2 text-sm text-indigo-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <p className="mb-5 text-xs text-gray-500">
          Password must contain at least 8 characters.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-indigo-500 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-medium text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
