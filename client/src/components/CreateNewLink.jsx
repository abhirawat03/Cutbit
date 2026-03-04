import React from "react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Api from "../api/axios.js";
import {QRCodeCanvas} from 'qrcode.react';

export default function CreateNewLink({ onClose }) {
  const [formData, setFormData] = useState({
    name:"",
    originalUrl: "",
    customAlias: "",
    expiryDate: ""
  });
  const [generatedLink, setGeneratedLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      setLoading(true);

      const res = await Api.post(
        "/short",
        formData
      );

      setGeneratedLink(res.data.data.shortUrl);
      console.log(res.data.data.shortUrl)

    } catch (error) {

      console.error("Create link error", error);

    } finally {

      setLoading(false);

    }
  };
  const downloadQR = () => {
        const canvas = document.getElementById("big-qr");
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "qr-code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  };
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
          <form onSubmit={handleSubmit}>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="text-gray-300 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="name your url"
                  className="w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="originalUrl" className="text-gray-300 text-sm">Original URL</label>
                <input
                  type="text"
                  name="originalUrl"
                  id="originalUrl"
                  value={formData.originalUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/very-long-url"
                  className="w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="customAlias" className="text-gray-300 text-sm">Custom Alias</label>
                <input
                  type="text"
                  name="customAlias"
                  id="customAlias"
                  value={formData.customAlias}
                  onChange={handleChange}
                  placeholder="Custom alias (optional)"
                  className="w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="text-gray-300 text-sm">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
                {loading ? "Generating..." : "Generate Link"}
              </button>
            </div>
          </form>

          {/* Right Side */}
          <div className="border border-dashed border-blue-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold text-white">
              Your shortened link
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Ready to share with the world
            </p>

            {generatedLink ? (
              <>
                <div className="w-40 h-40 bg-white rounded-xl mb-6 flex items-center justify-center p-2">
                  <QRCodeCanvas
                    id="big-qr"
                    size={150}
                    value={`${window.location.origin}/${generatedLink}`}
                  />
                </div>

                <div className="flex items-center justify-between w-full bg-[#1e293b] px-4 py-2 rounded-lg mb-4">
                  <span className="text-blue-400 truncate">
                    {window.location.origin}/{generatedLink}
                  </span>
                  <button className="text-sm bg-blue-600 px-3 py-1 rounded"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/${generatedLink}`
                      )
                    }
                  >
                    Copy
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button className="flex-1 border border-[#334155] py-2 rounded-lg hover:bg-[#1e293b] transition"
                    onClick={downloadQR}
                  >
                    Download QR
                  </button>
                  <button className="flex-1 border border-[#334155] py-2 rounded-lg hover:bg-[#1e293b] transition">
                    Share
                  </button>
                </div>

                <div className="mt-6 text-sm text-gray-400">
                  Real-time tracking enabled
                </div>
              </>
            ) : (
              <span className="text-gray-500">
                No link generated yet
              </span>
            )
            }
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