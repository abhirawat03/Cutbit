import React from "react";
import { IoClose } from "react-icons/io5";

export default function CreateNewLink({ onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#1e293b]">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Create New Link
            </h2>
            <p className="text-gray-400 text-sm">
              Shorten your URLs and track performance with ease.
            </p>
          </div>
          <button onClick={onClose}>
            <IoClose size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid md:grid-cols-2 gap-8">

          {/* Left Side */}
          <div className="space-y-6">
            <div>
              <label className="text-gray-300 text-sm">Original URL</label>
              <input
                type="text"
                placeholder="https://example.com/very-long-url"
                className="w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm">Custom Alias</label>
              <input
                type="text"
                placeholder="Custom alias (optional)"
                className="w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                className="w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
              Generate Link
            </button>
          </div>

          {/* Right Side */}
          <div className="border border-dashed border-blue-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-white">
              Your shortened link
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Ready to share with the world
            </p>

            <div className="w-40 h-40 bg-gray-200 rounded-xl mb-6" />

            <div className="flex items-center justify-between w-full bg-[#1e293b] px-4 py-2 rounded-lg mb-4">
              <span className="text-blue-400 truncate">
                shorty.io/my-cool-link
              </span>
              <button className="text-sm bg-blue-600 px-3 py-1 rounded">
                Copy
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button className="flex-1 border border-[#334155] py-2 rounded-lg hover:bg-[#1e293b] transition">
                QR Code
              </button>
              <button className="flex-1 border border-[#334155] py-2 rounded-lg hover:bg-[#1e293b] transition">
                Share
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-400">
              Real-time tracking enabled
            </div>
          </div>
        </div>
      </div>

      {/* Background Click Close */}
      <div
        onClick={onClose}
        className="absolute inset-0 -z-10"
      />
    </div>
  );
}