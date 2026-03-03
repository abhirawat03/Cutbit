import React from "react"

export default function Settings() {
  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your profile information and security preferences.
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#1f2937]">
            <h2 className="text-lg font-semibold">Profile Information</h2>
            <p className="text-gray-400 text-sm mt-1">
              Update your public profile name and avatar.
            </p>
          </div>

          <div className="p-6 space-y-6">

            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-600" />
              <div className="flex gap-4 text-sm">
                <button className="text-blue-500 hover:text-blue-400">
                  Change Photo
                </button>
                <button className="text-gray-400 hover:text-gray-300">
                  Remove
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-400">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue="Alex Rivera"
                  className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="alex@example.com"
                  className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] px-6 py-4 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-medium">
              Save Name
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#1f2937]">
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="text-gray-400 text-sm mt-1">
              Change your password to keep your account secure.
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="text-sm text-gray-400">
                Current Password
              </label>
              <input
                type="password"
                className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-400">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="mt-2 w-full bg-[#0b1220] border border-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] px-6 py-4 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-medium">
              Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#1f172a] border border-red-500/30 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-red-500/20">
            <h2 className="text-lg font-semibold text-red-400">
              Danger Zone
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Permanently delete your account and all associated data.
            </p>
          </div>

          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-gray-400 text-sm">
                This action is irreversible. Once deleted, you cannot recover your data.
              </p>
            </div>

            <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-sm font-medium">
              Delete Permanently
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}