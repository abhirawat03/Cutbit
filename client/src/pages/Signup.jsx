import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc"
import { Link, useNavigate } from 'react-router-dom'
import { useSignup } from "../hooks/mutations/useSignup"

function Signup() {
  const navigate = useNavigate()
  const signupMutation = useSignup()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  })

  const [error, setError] = useState("")

  const handleChange = (e) => {
    setError("")
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { fullName, email, password } = formData

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 8 || password.length > 64) {
      setError("Password must be between 8 and 64 characters")
      return
    }

    signupMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({
          fullName: "",
          email: "",
          password: ""
        })
        navigate("/dashboard")
      },

      onError: (error) => {
        const message =
          error.response?.data?.message || "Signup failed"
        setError(message)
      }
    })

  }
  const handleGoogleLogin = () => {
    window.location.href =`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`
  }

  return (
    <>
      <h1 className='text-2xl font-bold'>Create your account</h1>
      <p className='text-sm text-center text-gray-400 mb-2'>
        Start shortening and tracking your links today. <br /> No credit card required
      </p>

      <button
        type="button"
        disabled={signupMutation.isPending}
        onClick={handleGoogleLogin}
        className="flex items-center justify-center bg-[#63686c5e] w-full gap-2 rounded-md p-2 hover:bg-gray-800 border border-[#7d83885e]"
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
          <label htmlFor="fullName" className='font-bold'>Full Name</label>
          <input
            type="text"
            id='fullName'
            name='fullName'
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder='yourname'
            className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]'
          />

          <label htmlFor="email" className='font-bold'>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder='name@gmail.com'
            className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]'
          />

          <label htmlFor="password" className='font-bold'>Password</label>
          <input
            type="password"
            id='password'
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder='••••••••'
            minLength={8}
            maxLength={64}
            className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]'
          />
        </div>

        <button
          type='submit'
          disabled={signupMutation.isPending}
          className={`p-2 rounded-md mt-3 ${
            signupMutation.isPending
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-blue-700"
          }`}
        >
          {signupMutation.isPending ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div>
        <p className='text-gray-400 text-sm'>
          Already have an account?
          <Link to="/login">
            <span className='text-[#2563EB] hover:text-blue-400'> Sign In</span>
          </Link>
        </p>
      </div>
    </>
  )
}

export default Signup