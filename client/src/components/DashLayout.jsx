import React, { useState, useEffect, useRef } from 'react'
import logo from "../assets/images/logo.png"
import { MdDashboard } from "react-icons/md";
import { IoLinkSharp } from "react-icons/io5";
import { BsGearFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import CreateNewLink from './CreateNewLink';
import { useAuth } from "../context/AuthContext";

function DashLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // ✅ scroll to top on route change
  useEffect(() => {
    // desktop container scroll
  contentRef.current?.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  // mobile fallback
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  }, [location.pathname]);

  useEffect(() => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
}, []);

  // ✅ always close sidebar on route change (important)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // ✅ lock body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  if (loading) return null;
  if (!user) return null;

  const handleLogout = () => {
    try {
      setIsLoggingOut(true);
      logout();
      navigate('/');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ✅ central function (no more duplication)
  const closeSidebar = () => setIsSidebarOpen(false);

  const navItems = [
    { name: "Dashboard", icon: MdDashboard, path: "/dashboard" },
    { name: "My Links", icon: IoLinkSharp, path: "/dashboard/links" },
    { name: "Settings", icon: BsGearFill, path: "/dashboard/settings" },
  ];

  return (
    <section className='md:grid md:grid-cols-[260px_1fr] min-h-screen relative bg-[#030a2a] text-white select-none'>
      
      {/* background glow */}
      <div className="-z-10 fixed top-10 -left-15 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,#2563EB,transparent_60%)] opacity-15 blur-xl"></div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-[260px] bg-[#030a2a]  md:bg-[#030d3993] border-r border-[#63686c5e]
        flex flex-col justify-between p-4 z-40 transform transition-transform duration-300 overflow-y-auto
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <div className='flex flex-col gap-6 pt-8 md:pt-0'>
          
          {/* Logo */}
          <Link to="/dashboard" onClick={closeSidebar}>
            <div className='flex items-center gap-2'>
              <img src={logo} alt="Logo" className='w-12 h-12'/>
              <div>
                <h1 className='text-lg font-bold'>Cutbit</h1>
                <p className='uppercase text-xs tracking-widest'>Analytics Hub</p>
              </div>
            </div>
          </Link>

          {/* Nav */}
          <ul className="flex flex-col ml-1 space-y-2">
            {navItems.map(({ name, icon, path }) => {
              const Icon = icon;
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/dashboard"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-2 rounded-lg transition-all duration-200 group relative
                    ${isActive ? "bg-[#2564eb29]" : "hover:bg-[#2564eb29]"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2563EB]" />
                      )}
                      <Icon
                        size={26}
                        className={isActive ? "text-[#2563EB]" : "text-gray-400 group-hover:text-[#2563EB]"}
                      />
                      <span className={isActive ? "text-[#2563EB]" : "text-gray-400 group-hover:text-[#2563EB]"}>
                        {name}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </ul>
        </div>

        {/* Bottom */}
        <div className='flex flex-col gap-3'>
          
          {/* Create */}
          <button
            onClick={() => {
              closeSidebar();
              setIsCreateModalOpen(true);
            }}
            className='flex items-center p-2 gap-2 bg-[#2563EB] px-4 rounded-md hover:bg-blue-700 cursor-pointer'
          >
            <FaPlus />
            Create New Link
          </button>

          {/* Logout */}
          <button
            className={`p-2 rounded-md ${
              isLoggingOut
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 cursor-pointer"
            }`}
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>

          {/* User */}
          <div className='flex items-center gap-4'>
            <img
              src={user?.avatar || DEFAULT_AVATAR}
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h4>{user?.fullName}</h4>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main */}
      <div className='flex flex-col min-h-screen md:h-screen'>

        {/* Toggle button */}
        <button
          className="fixed top-3 left-3 md:hidden z-50 text-2xl bg-[#0000008d] px-2 py-1 rounded-lg"
          onClick={() => setIsSidebarOpen(prev => !prev)}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>

        {/* Modal */}
        {isCreateModalOpen && (
          <CreateNewLink
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}

        {/* Content */}
        <div ref={contentRef} className='flex-1 overflow-y-auto p-5 pt-15 md:p-5 '>
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default DashLayout;