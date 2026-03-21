import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

function Footer() {
  return (
    <footer className="border-t border-[#202733] text-white">
      
      <div className="max-w-6xl mx-auto px-10 md:px-6 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:items-center ">

        {/* Logo / About */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Cutbit logo" className="w-9 h-9 md:w-10 md:h-10" />
            <h1 className="font-bold text-lg md:text-xl">Cutbit</h1>
          </div>

          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-[300px]">
            A modern URL shortener with analytics built using the MERN stack.
          </p>
        </div>

        <div className="grid grid-cols-2"> 
          {/* Product */}
        <div>
          <h3 className="font-semibold mb-3 text-sm md:text-base">Product</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link className="hover:text-white block py-1" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className="hover:text-white block py-1" to="/links">
                Links
              </Link>
            </li>
            <li>
              <Link className="hover:text-white block py-1" to="/analytics">
                Analytics
              </Link>
            </li>
          </ul>
        </div>

        {/* Developer */}
        <div>
          <h3 className="font-semibold mb-3 text-sm md:text-base">Developer</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a
                href="https://github.com/abhirawat03/Cutbit"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white block py-1"
              >
                GitHub
              </a>
            </li>
            <li>
              <Link className="hover:text-white block py-1" to="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="hover:text-white block py-1" to="/terms">
                Terms
              </Link>
            </li>
          </ul>
        </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-gray-400 text-xs sm:text-sm border-t border-[#202733] py-5 px-4">
        © 2026 Cutbit. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;