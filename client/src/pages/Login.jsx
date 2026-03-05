import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import Api from '../api/axios';

function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
      })
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        })
      }
    
       const handleSubmit = async (e) => {
        e.preventDefault()
    
        const { email, password } = formData
    
        if (!email || !password) {
          alert("All fields are required")
          return
        }
    
        try {
    
          const res = await Api.post("/users/login", formData)
    
          // cookie already stored by backend
          if(res.status === 200){
            navigate("/dashboard")
          }
    
        } catch (error) {
          console.error(error.response?.data?.message)
        }
      }
  return (
    <>
        <h1 className='text-2xl font-bold'>Welcome back</h1>
            <p className='text-sm text-gray-400 mb-2'>The modern way to manage your links.</p>
            <div className='flex items-center justify-center bg-[#63686c5e] border border-[#7d83885e] w-full gap-2 rounded-md p-2 hover:bg-gray-800'>
                <FcGoogle/>
                <h3 className='text-gray-300'>Continue with Google</h3>
            </div>
            <div className='flex flex-row items-center w-full gap-1'>
                <div className='border-b-2 w-18 border-[#63686c5e]'></div>
                <h1 className='uppercase text-xs text-gray-400'>Or Continue With Email</h1>
                <div className='border-b-2 w-18 border-[#63686c5e]'></div>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col w-full gap-2'>
                <div className='flex flex-col gap-2 text-sm text-gray-400'>
                    <label htmlFor="email" className='font-bold'>Email</label>
                    <input 
                        type="text" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='name@gmail.com' 
                        className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]'/>
                    <label htmlFor="password" className='font-bold'>Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='••••••••••••••••' 
                        className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]'/>
                </div>
                <button type='submit' className='bg-[#2563EB] p-2 rounded-md mt-3 hover:bg-blue-700'>Login</button>
            </form>
            <div>
                <p className='text-gray-400 text-sm'>Don't have a account? 
                    <Link to="/register"><span className='text-[#2563EB] hover:text-blue-400'> Create an account</span></Link>
                </p>
            </div>
    </>
  )
}

export default Login