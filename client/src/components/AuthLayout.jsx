import React from 'react'
import { FcGoogle } from "react-icons/fc";
import logo from "../images/logo.png"
import { Link, Outlet } from 'react-router-dom';

function Signup() {
  return (
    <section className='text-white flex flex-col min-h-screen gap-8 relative bg-[#030a2a] select-none'>
        <div className="absolute -top-48 left-1/3 -translate-x-1/2 w-[900px] h-[700px] bg-[radial-gradient(circle,#2563EB,transparent_70%)] opacity-20 blur-xl"></div>
        <div className='mt-2 ml-2 z-10'>
            <Link to="/" className='cursor-pointer'>
                <div className="flex flex-row gap-2 items-center ">
                    <img src={logo} alt="" className="w-15 h-15" />
                    <h1 className="font-bold text-white text-3xl">Cutbit</h1>
                </div>
            </Link>
        </div>
        <div className='flex flex-col items-center bg-[#040d3814] shadow-xl p-10 shadow-[#2564eb4f] border border-[#63686c5e] gap-4 rounded-2xl mx-auto z-10'>
            <Outlet/>
        </div>
        <div className="absolute bottom-0 translate-x-1/2 w-[900px] h-[700px] bg-[radial-gradient(circle,#2563EB,transparent_70%)] opacity-20 blur-xl"></div>
    </section>
  )
}

export default Signup