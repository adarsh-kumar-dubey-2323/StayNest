import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()

  const { setUser, setOwner, axios } = useContext(AppContext)

  // Correct useState
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Input change handler
  const onChangeHandler = (e) => {

    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Login submit

const submitHandler = async (e) => {
  e.preventDefault();

  try {
    const { data } = await axios.post("/api/user/login", formData);

    if (data.success) {
      toast.success(data.message || "Login successful!");

      const loggedInUser = data.user;
      setUser(loggedInUser);

      if (loggedInUser?.role === "owner") {
        setOwner(loggedInUser);
        navigate("/owner", { replace: true });
      } else {
        setOwner(null);
        navigate("/", { replace: true });
      }
    } else {
      toast.error(data.message || "Login failed");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Unable to log in. Please try again."
    );
  }
};


  return (
    <div className="min-h-[calc(100vh-89px)] w-full bg-gray-50 px-4 py-16 sm:py-20 mt-20">

      <div className="mx-auto flex w-full max-w-md justify-center">

        <form
          onSubmit={submitHandler}
          className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-[0_10px_35px_rgba(0,0,0,0.08)] sm:px-8 sm:py-9"
        >

          {/* Header */}

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Please sign in to continue
            </p>

          </div>


          {/* Email */}

          <div className="mb-5">

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={onChangeHandler}
                autoComplete="email"
                required
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />

            </div>

          </div>


          {/* Password */}

          <div className="mb-5">

            <div className="mb-2 flex items-center justify-between">

              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <button
                type="button"
                className="text-xs font-medium text-indigo-500 transition hover:text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>

            </div>

            <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={onChangeHandler}
                autoComplete="current-password"
                required
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />

            </div>

          </div>


          {/* Login Button */}

          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-xl bg-indigo-500 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-600 active:scale-[0.98]"
          >
            Login
          </button>


          {/* Signup */}

          <div className="mt-7 text-center">

            <p className="text-sm text-gray-500">

              Don't have an account?

              <Link
                to="/signup"
                className="ml-1 font-medium text-indigo-500 transition hover:text-indigo-600 hover:underline"
              >
                Sign up
              </Link>

            </p>

          </div>

        </form>

      </div>

    </div>
  )
}

export default Login;
