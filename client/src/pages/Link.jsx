import { useState } from "react";
import { Link } from "react-router-dom";
import EditLink from "../components/EditLink";

export default function LinkView() {
    const [editOpen, setEditOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);
    return (
        <div className="min-h-screen bg-[#0b1220] text-white p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">

                {/* LEFT SECTION */}
                <div className="col-span-2 space-y-6">

                    {/* Header */}
                    <div className="bg-[#111827] p-6 rounded-xl">
                        <h1 className="text-2xl font-semibold text-blue-400">
                            short.ly/summer-campaign-24
                        </h1>

                        <p className="text-gray-400 mt-2 break-all">
                            https://www.marketing-hub.com/campaigns/summer-collection/tracking
                        </p>

                        <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                            Copy Link
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#111827] p-6 rounded-xl">
                            <p className="text-gray-400 text-sm">Total Clicks</p>
                            <h2 className="text-3xl font-bold mt-2">12,842</h2>
                        </div>

                        <div className="bg-[#111827] p-6 rounded-xl">
                            <p className="text-gray-400 text-sm">Last Accessed</p>
                            <h2 className="text-2xl font-semibold mt-2">2 mins ago</h2>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-[#111827] p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Metadata</h3>

                        <div className="flex justify-between text-gray-400 mb-3">
                            <span>Created On</span>
                            <span>Oct 24, 2023</span>
                        </div>

                        <div className="flex justify-between text-gray-400">
                            <span>Status</span>
                            <span className="text-green-400">Active</span>
                        </div>
                    </div>

                    {/* Analytics Button */}
                    <Link to="/dashboard/analytics">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold">
                            View Detailed Analytics
                        </button>
                    </Link>

                </div>

                {/* RIGHT SIDEBAR */}
                <div className="space-y-6">

                    {/* QR Code */}
                    <div className="bg-[#111827] p-6 rounded-xl text-center flex flex-col items-center">
                        <p className="text-gray-400 mb-4">QR Code</p>

                        <div className="bg-white p-4 rounded-lg inline-block">
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://short.ly/summer-campaign-24"
                                alt="qr"
                            />
                        </div>

                        <button className="mt-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">
                            Download
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#111827] p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

                        <button className="w-full bg-green-700 hover:bg-green-600 py-2 rounded-lg mb-3"
                            onClick={() => {
                                setSelectedLink({
                                    originalUrl: "https://store.example.com/collections/summer",
                                    shortCode: "summer24",
                                    status: "active",
                                });
                                setEditOpen(true);
                            }}
                        >
                            Edit
                        </button>

                        <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg">
                            Delete Link
                        </button>
                    </div>

                </div>
                {editOpen && (
                    <EditLink
                        link={selectedLink}
                        onClose={() => setEditOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}