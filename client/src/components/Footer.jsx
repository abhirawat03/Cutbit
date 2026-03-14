import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

function Footer() {
  return (
    <footer className="border-t border-[#202733] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        {/* Logo / About */}
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Cutbit logo" className="w-10 h-10" />
            <h1 className="font-bold text-xl">Cutbit</h1>
          </div>

          <p className="text-gray-400 text-sm mt-3">
            A modern URL shortener with analytics built using the MERN stack.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/links">Links</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
          </ul>
        </div>

        {/* Developer */}
        <div>
          <h3 className="font-semibold mb-3">Developer</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a
                href="https://github.com/abhirawat03/Cutbit"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>

      </div>

      <div className="text-center text-gray-400 text-sm border-t border-[#202733] py-6">
        © 2026 Cutbit. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;