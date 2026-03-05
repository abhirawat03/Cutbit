import React, { useState, useEffect,useRef } from 'react'
import logo from "../images/logo.png"
import { MdDashboard } from "react-icons/md";
import { IoLinkSharp } from "react-icons/io5";
import { FaChartSimple } from "react-icons/fa6";
import { BsGearFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { NavLink, Outlet } from 'react-router-dom';
import { useLocation } from "react-router-dom"
import CreateNewLink from './CreateNewLink';

function DashLayout() {
  const location = useLocation()
  const contentRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [location.pathname])
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: "Dashboard", icon: MdDashboard, path: "/dashboard" },
    { name: "My Links", icon: IoLinkSharp, path: "/dashboard/links" },
    { name: "Analytics", icon: FaChartSimple, path: "/dashboard/analytics" },
    { name: "Settings", icon: BsGearFill, path: "/dashboard/settings" },
  ]
  return (
    <section className='md:grid md:grid-cols-[260px_1fr] min-h-screen relative bg-[#030a2a] text-white select-none'>
      <div className="-z-10 fixed top-10 -left-15 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,#2563EB,transparent_60%)] opacity-15 blur-xl"></div>
      <aside className={`fixed md:static top-0 left-0 h-full w-[260px] bg-[#030d3993] border-r border-[#63686c5e]
    flex flex-col justify-between p-4 z-40 transform transition-transform duration-300 
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-row items-center gap-2'>
            <div>
              <img src={logo} alt="" className='w-12 h-12' />
            </div>
            <div>
              <h1 className='text-lg font-bold'>Cutbit</h1>
              <p className='uppercase text-xs tracking-widest'>Analytics Hub</p>
            </div>
          </div>
          <ul className="flex flex-col ml-1 space-y-2 z-10">
            {navItems.map(({ name, icon, path }) => {
              const Icon = icon;
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/dashboard"} // exact match only for dashboard
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-2 rounded-lg transition-all duration-200 group
                  ${isActive
                      ? "bg-[#2564eb29]"
                      : "hover:bg-[#2564eb29]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={26}
                        className={`transition-colors duration-200 ${isActive
                          ? "text-[#2563EB]"
                          : "text-gray-400 group-hover:text-[#2563EB]"
                          }`}
                      />
                      <span
                        className={`transition-colors duration-200 ${isActive
                          ? "text-[#2563EB]"
                          : "text-gray-400 group-hover:text-[#2563EB]"
                          }`}
                      >
                        {name}
                      </span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </ul>
        </div>
        <div className='flex flex-row items-center gap-4'>
          <div className='w-10 h-10 bg-[#2563EB] rounded-3xl'></div>
          <div>
            <h4>Abhishek Rawat</h4>
          </div>
        </div>
      </aside>
        {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />)}
      
      <div className='flex flex-col min-h-screen md:h-screen'>
        <div className=' flex justify-between items-center p-4 fixed top-0 right-0 left-0 md:left-[260px] z-30 backdrop-blur-md bg-[#030a2a]/40 border-b border-[#63686c5e]'>
          <button
            className="md:hidden text-white z-80"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
          <h1 className='text-xl font-bold'>Dashboard Overview</h1>
          <div className='flex gap-3'>
            <div className='border-[#63686c5e] border-2 p-2 rounded-md flex items-center gap-2'>
              <IoSearchSharp />
              <input type="search" className='outline-0' placeholder='Search links...' />
            </div>
            <button onClick={() => setOpen(true)} className='flex flex-row items-center gap-2 bg-[#2563EB] px-4 rounded-md hover:bg-blue-700'>
              <FaPlus />
              Create New Link
            </button>
            
          </div>
        </div>
        {open && <CreateNewLink onClose={() => setOpen(false)} />}
        <div ref={contentRef} className='flex-1 overflow-y-auto pt-[98px] p-5'>
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default DashLayout