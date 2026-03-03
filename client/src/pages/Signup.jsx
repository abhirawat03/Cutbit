import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';

function Signup() {
  return (
    <>
        <h1 className='text-2xl font-bold'>Create your account</h1>
            <p className='text-sm text-center text-gray-400 mb-2'>Start shortening and tracking your links today. <br /> No credit card required</p>
            <div className='flex items-center justify-center bg-[#63686c5e] w-full gap-2 rounded-md p-2 hover:bg-gray-800 border border-[#7d83885e]'>
                <FcGoogle/>
                <h3 className='text-gray-300'>Continue with Google</h3>
            </div>
            <div className='flex flex-row items-center w-full gap-1'>
                <div className='border-b-2 w-18 border-[#63686c5e]'></div>
                <h1 className='uppercase text-xs text-gray-400'>Or Continue With Email</h1>
                <div className='border-b-2 w-18 border-[#63686c5e]'></div>
            </div>
            <form action="" className='flex flex-col w-full gap-2'>
                <div className='flex flex-col gap-2 text-sm text-gray-400'>
                    <label htmlFor="" className='font-bold'>Full Name</label>
                    <input type="text" placeholder='yourname' className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]'/>
                    <label htmlFor="" className='font-bold'>Email</label>
                    <input type="text" placeholder='name@gmail.com' className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]'/>
                    <label htmlFor="" className='font-bold'>Password</label>
                    <input type="password" placeholder='••••••••••••••••' className='outline-0 rounded-md p-2 text-white border border-[#7d83885e] bg-[#63686c5e]'/>
                </div>
                <button type='submit' className='bg-[#2563EB] p-2 rounded-md mt-3 hover:bg-blue-700'>Create Account</button>
            </form>
            <div>
                <p className='text-gray-400 text-sm'>Already have an account? 
                    <Link to="/login"><span className='text-[#2563EB] hover:text-blue-400'> Sign In</span></Link>
                </p>
            </div>
    </>
  )
}

export default Signup