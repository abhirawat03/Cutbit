import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useUpdateLink } from "../hooks/mutations/useUpdateLink";

export default function EditLink({ link, onClose}) {
  const updateMutation = useUpdateLink();
  const formattedExpiry = link?.expiryDate
    ? new Date(link.expiryDate).toISOString().split("T")[0]
    : "";

  
  const [form, setForm] = useState({
    originalUrl: link?.originalUrl || "",
    shortUrl: link?.shortUrl || "",
    expiryDate: formattedExpiry,
    status: link?.status || "active",
  });
  const hasChanges =
  form.originalUrl !== link.originalUrl ||
  form.shortUrl !== link.shortUrl ||
  form.status !== link.status ||
  form.expiryDate !== formattedExpiry;

  const updateLink = async () => {
  updateMutation.mutate(
    {
      id: link._id,
      data: form
    },
    {
      onSuccess: () => {
        onClose();
      }
    }
  );
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Modal */}
      <div className="w-full max-w-2xl bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#1e293b]">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Link</h2>
            <p className="text-gray-400 text-sm">
              Update your shortened URL details and settings.
            </p>
          </div>
          <button onClick={onClose}>
            <IoClose size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Original URL */}
          <div>
            <label className="text-gray-300 text-sm">Original Long URL</label>
            <input
              type="text"
              value={form.originalUrl}
              onChange={(e) =>
                setForm({ ...form, originalUrl: e.target.value })
              }
              className="w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Custom Alias */}
          <div>
            <label className="text-gray-300 text-sm">Custom Alias</label>
            <div className="flex mt-2">
              <span className="bg-[#1e293b] px-4 py-3 border border-r-0 border-[#334155] rounded-l-lg text-gray-400">
                shorty.io/
              </span>
              <input
                type="text"
                value={form.shortUrl}
                onChange={(e) =>  
                  setForm({ ...form, shortUrl: e.target.value })
                }
                className="flex-1 bg-[#1e293b] border border-[#334155] rounded-r-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="text-gray-300 text-sm">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) =>
                setForm({ ...form, expiryDate: e.target.value })
              }
              className="w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="text-gray-300 text-sm">Link Status</label>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => setForm({ ...form, status: "active" })}
                className={`px-4 py-2 rounded-lg ${
                  form.status === "active"
                    ? "bg-blue-600 text-white"
                    : "bg-[#1e293b] text-gray-400"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setForm({ ...form, status: "paused" })}
                className={`px-4 py-2 rounded-lg ${
                  form.status === "paused"
                    ? "bg-blue-600 text-white"
                    : "bg-[#1e293b] text-gray-400"
                }`}
              >
                Paused
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button className={`flex-1 text-white font-semibold py-3 rounded-lg cursor-pointer
            ${hasChanges
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed"}
            `}
              onClick={updateLink}
              disabled={!hasChanges}
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 cursor-pointer hover:bg-red-800 text-gray-300 font-semibold py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>

          {/* Delete */}
          <div className="pt-4 text-center">
            <button className="text-red-500 hover:text-red-400 text-sm">
              Delete this link permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}