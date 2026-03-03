import { Link } from "react-router-dom";
import logo from "../images/logo.png";

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 left-0 w-full bg-[#030a2a] border-b-2 border-[#202733]">
      {/* content */}
      <div className="flex justify-between items-center px-4 py-4 mx-5">
        <Link to="/">
          <div className="flex flex-row gap-2 items-center cursor-pointer">
            <img src={logo} alt="" className="w-10 h-10" />
            <h1 className="font-bold text-white text-xl">Cutbit</h1>
          </div>
        </Link>

        <div className="flex flex-row gap-8 items-center">
          <div className="flex gap-6 font-bold">
            <Link to="/#features" className="text-gray-300 hover:text-white">Features</Link>
            <Link to="/#how" className="text-gray-300 hover:text-white">How it works</Link>
            {/* <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link> */}
          </div>
          <div className="text-gray-300 text-2xl font-semibold">|</div>
          <div className="flex gap-6 font-bold items-center">
            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
            <Link to="/register" className="text-white hover:bg-blue-700 bg-[#2563EB] p-2 rounded-xl">Get Started</Link>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;