import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import Api from '../api/axios';
import { useLogin } from '../hooks/mutations/useLogin';
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth();
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
      onSuccess: (data) => {
        setUser(data.user || data)
        navigate("/dashboard");
      },
      onError: (error) => {
        setError(error.response?.data?.message || "Login failed");
      }
    });
  }
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`
  }
  return (
    <>
      <h1 className='text-2xl font-bold'>Welcome back</h1>
      <p className='text-sm text-gray-400 mb-2'>The modern way to manage your links.</p>
      <button
        type="button"
        disabled={loginMutation.isPending}
        onClick={handleGoogleLogin}
        className="flex items-center justify-center bg-[#63686c5e] border border-[#7d83885e] w-full gap-2 rounded-md p-2 hover:bg-gray-800 cursor-pointer"
      >
        <FcGoogle />
        <span className="text-gray-300">Continue with Google</span>
      </button>
      <div className='flex flex-row items-center w-full gap-1'>
        <div className='border-b-2 w-18 border-[#63686c5e]'></div>
        <h1 className='uppercase text-xs text-gray-400'>Or Continue With Email</h1>
        <div className='border-b-2 w-18 border-[#63686c5e]'></div>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col w-full gap-2'>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className='flex flex-col gap-2 text-sm text-gray-400'>
          <label htmlFor="email" className='font-bold'>Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='name@gmail.com'
            className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]' />
          <label htmlFor="password" className='font-bold'>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            minLength={8}
            maxLength={64}
            value={formData.password}
            onChange={handleChange}
            placeholder='••••••••••••••••'
            className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]' />
        </div>
        <button
          type='submit'
          disabled={loginMutation.isPending}
          className={`p-2 rounded-md mt-3 cursor-pointer ${loginMutation.isPending ? "bg-blue-400 cursor-not-allowed" : "bg-[#2563EB] hover:bg-blue-700"
            }`}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}</button>

      </form>
      <div>
        <p className='text-gray-400 text-sm cursor-pointer'>Don't have a account?
          <Link to="/register"><span className='text-[#2563EB] hover:text-blue-400'> Create an account</span></Link>
        </p>
      </div>
    </>
  )
}

export default Login