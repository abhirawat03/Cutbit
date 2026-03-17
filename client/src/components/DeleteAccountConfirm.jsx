import React, { useState } from "react";

export default function DeleteAccountConfirm({ onClose, onConfirm, loading }) {
  const [confirmText, setConfirmText] = useState("");

  const isValid = confirmText === "DELETE";

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#111827] p-6 rounded-2xl w-full max-w-md border border-[#1f2937]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-red-400">
          Delete Account
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          This action is irreversible. All your links and analytics will be permanently deleted.
        </p>

        <p className="text-sm mt-4">
          Type <span className="font-bold text-white">DELETE</span> to confirm:
        </p>

        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(confirmText)}
            disabled={!isValid || loading}
            className={`px-4 py-2 rounded-lg font-medium
              ${
                isValid
                  ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                  : "bg-gray-600 cursor-not-allowed"
              }
            `}
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}