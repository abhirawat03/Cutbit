import React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../assets/images/logo.png";

function AuthLayout() {
  return (
    <section className="relative min-h-screen bg-[#030a2a] text-white overflow-hidden flex flex-col">

      {/* Background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(circle,#2563EB,transparent_70%)] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(circle,#2563EB,transparent_70%)] opacity-20 blur-3xl"></div>

      {/* Header */}
      <div className="z-10 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold">Cutbit</h1>
        </Link>
      </div>

      {/* Centered Content */}
      <div className="flex flex-1 items-center justify-center px-4 z-10">
        
        {/* Card */}
        <div className="w-full max-w-md bg-[#040d3863] border border-[#63686c5e] shadow-xl shadow-[#2564eb4f] rounded-2xl p-6 sm:p-8 backdrop-blur-md">
          <Outlet />
        </div>

      </div>
    </section>
  );
}

export default AuthLayout;