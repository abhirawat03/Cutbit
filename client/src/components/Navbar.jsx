import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const { user} = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };
}, [open]);

  return (
    <nav className="fixed top-0 z-50 left-0 w-full bg-[#030a2a] border-b-2 border-[#202733]">
      
      <div className="flex justify-between items-center px-4 py-4 mx-3 md:mx-5">
        
        {/* Logo */}
        <Link to="/">
          <div className="flex gap-2 items-center cursor-pointer">
            <img src={logo} alt="" className="w-9 h-9 md:w-10 md:h-10" />
            <h1 className="font-bold text-white text-lg md:text-xl">Cutbit</h1>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex lg:gap-8 md:gap-4 items-center">
          
          <div className="flex gap-6 font-bold">
            <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link to="/#insights" className="text-gray-300 hover:text-white">Insights</Link>
            <Link to="/#features" className="text-gray-300 hover:text-white">Features</Link>
            <Link to="/#how" className="text-gray-300 hover:text-white">How it works</Link>
          </div>

          <div className="text-gray-300 text-2xl font-semibold">|</div>

          <div className="flex gap-6 font-bold items-center">
            {user ? (
              <Link
                to="/dashboard"
                className="text-white hover:bg-blue-700 bg-[#2563EB] px-4 py-2 rounded-xl"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="text-white hover:bg-blue-700 bg-[#2563EB] px-4 py-2 rounded-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-white text-2xl">
            {open ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden min-h-screen px-4 pb-4 pt-8 flex flex-col items-center gap-4 bg-[#030a2a] border-t border-[#202733]">

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/#insights"
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            Insights
          </Link>
          <Link
            to="/#features"
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            Features
          </Link>

          <Link
            to="/#how"
            onClick={() => setOpen(false)}
            className="text-gray-300 hover:text-white"
          >
            How it works
          </Link>

          <div className="border-t border-[#202733] pt-4 flex flex-col gap-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-white bg-[#2563EB] px-4 py-2 rounded-xl text-center"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-white bg-[#2563EB] px-4 py-2 rounded-lg text-center"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="text-white bg-[#2563EB] px-4 py-2 rounded-lg text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}

export default Navbar;