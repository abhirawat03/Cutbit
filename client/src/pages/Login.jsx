import React, { useState, useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
// import Api from '../api/axios';
import { useLogin } from '../hooks/mutations/useLogin';
import { useAuth } from "../context/AuthContext";

function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate()
  const loginMutation = useLogin();
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setError("")
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { email, password } = formData

    if (!email.trim() || !password.trim()) {
      setError("All fields are required")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8 || password.length > 64) {
      setError("Password must be between 8 and 64 characters")
      return
    }
    loginMutation.mutate(formData, {
      onError: (error) => {
        setError(error.response?.data?.message || "Login failed");
      }
    });
  }
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`
  }
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);
  return (
    <div className="w-full mx-auto px-6 py-8 flex flex-col gap-4 items-center">

      <h1 className='text-xl sm:text-2xl font-bold text-center sm:text-left'>
        Welcome back
      </h1>

      <p className='text-xs sm:text-sm text-gray-400 mb-2 text-center sm:text-left'>
        The modern way to manage your links.
      </p>

      {/* Google Button */}
      <button
        type="button"
        disabled={loginMutation.isPending}
        onClick={handleGoogleLogin}
        className="flex items-center justify-center bg-[#63686c5e] border border-[#7d83885e] w-full gap-2 rounded-md p-2 hover:bg-gray-800 cursor-pointer"
      >
        <FcGoogle />
        <span className="text-gray-300 text-sm sm:text-base">
          Continue with Google
        </span>
      </button>

      {/* Divider */}
      <div className='flex items-center w-full gap-2'>
        <div className='flex-1 border-b border-[#63686c5e]'></div>
        <span className='uppercase text-[10px] sm:text-xs text-gray-400 whitespace-nowrap'>
          Or Continue With Email
        </span>
        <div className='flex-1 border-b border-[#63686c5e]'></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='flex flex-col w-full gap-3'>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className='flex flex-col gap-2 text-xs sm:text-sm text-gray-400'>

          <label htmlFor="email" className='font-bold'>Email</label>
          <input
            type="text"
            id="email"
            name="email"
            disabled={loginMutation.isPending}
            value={formData.email}
            onChange={handleChange}
            placeholder='name@gmail.com'
            className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e] w-full'
          />

          <label htmlFor="password" className='font-bold'>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            minLength={8}
            maxLength={64}
            disabled={loginMutation.isPending}
            value={formData.password}
            onChange={handleChange}
            placeholder='••••••••••••••••'
            className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e] w-full'
          />
        </div>
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-xs text-blue-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type='submit'
          disabled={loginMutation.isPending}
          className={`p-2 rounded-md mt-2 cursor-pointer ${loginMutation.isPending
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-blue-700"
            }`}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Footer */}
      <div>
        <p className='text-gray-400 text-xs sm:text-sm text-center'>
          Don't have an account?
          <Link to="/register">
            <span className='text-blue-400 hover:underline ml-1'>
              Create an account
            </span>
          </Link>
        </p>
      </div>

    </div>
  )
}

export default Login