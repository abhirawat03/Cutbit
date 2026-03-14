import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import EditLink from "../components/EditLink";
import { IoArrowBack } from "react-icons/io5";
import { useLink } from "../hooks/queries/useLink";
import { QRCodeCanvas } from 'qrcode.react';
import { useDeleteLink } from "../hooks/mutations/useDeleteLink";

export default function LinkView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const deleteMutation = useDeleteLink();
    const { data: link, isLoading } = useLink(id);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);
    const deleteLink = (id) => {
        deleteMutation.mutate(id);
    };
    const copyToClipboard = (shortUrl) => {
        navigator.clipboard.writeText(
            `${import.meta.env.VITE_BACKEND_URL_ID}/${shortUrl}`
        );
    };
    const downloadQR = () => {
        const canvas = document.getElementById("big-qr");
        if (!canvas) return;
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${link?.shortUrl}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return <p className="text-white">Loading...</p>;
    }
    return (
        <div className="h-full text-white">
            <div className="max-w-7xl mx-auto mb-6 flex items-center gap-3 text-sm text-gray-400">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-white"
                >
                    <IoArrowBack size={18} />
                </button>

                <Link to="/dashboard/links" className="hover:text-white">
                    My Links
                </Link>

                <span>/</span>

                <span className="text-white font-medium">
                    {link.shortUrl}
                </span>

            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">

                {/* LEFT SECTION */}
                <div className="col-span-2 space-y-6">

                    {/* Header */}
                    <div className="bg-[#111827] p-6 rounded-xl">
                        <h1 className="text-2xl font-bold mt-3">
                            <a
                                href={`${import.meta.env.VITE_BACKEND_URL_ID}/${link?.shortUrl}`}
                                target="_blank"
                                className="hover:underline"
                            >
                                {import.meta.env.VITE_BACKEND_URL_ID}/
                                <span className="text-teal-400">{link?.shortUrl}</span>
                            </a>
                        </h1>

                        <p className="text-gray-400 mt-2 break-all">
                            {link.originalUrl}
                        </p>

                        <button
                            onClick={() => { copyToClipboard(link.shortUrl) }}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                            Copy Link
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#111827] p-6 rounded-xl">
                            <p className="text-gray-400 text-sm">Total Clicks</p>
                            <h2 className="text-3xl font-bold mt-2">{link?.totalClicks}</h2>
                        </div>

                        <div className="bg-[#111827] p-6 rounded-xl">
                            <p className="text-gray-400 text-sm">Created On</p>
                            <h2 className="text-2xl font-semibold mt-2">{new Date(link.createdAt).toLocaleDateString()}</h2>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937]">
                        <h3 className="text-lg font-semibold mb-5">Metadata</h3>

                        <div className="space-y-4 text-sm">

                            <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
                                <span className="text-gray-400">Expires</span>
                                <span className="text-white font-medium">
                                    {link?.expiryDate
                                        ? new Date(link.expiryDate).toLocaleDateString()
                                        : "Never"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
                                <span className="text-gray-400">Destination</span>
                                <span className="text-white font-medium truncate max-w-[160px]">
                                    {new URL(link?.originalUrl).hostname}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Status</span>

                                <span
                                    className={`px-2.5 py-1 text-xs rounded-full font-medium
                                        ${link?.status === "active"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-red-500/20 text-red-400"
                                        }`}
                                >
                                    {link?.status?.toUpperCase()}
                                </span>

                            </div>

                        </div>
                    </div>

                    {/* Analytics Button */}
                    <Link to={`/dashboard/links/${id}/analytics`}>
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
                            <QRCodeCanvas
                                id="big-qr"
                                size={170}
                                value={`${import.meta.env.VITE_BACKEND_URL_ID}/${link.shortUrl}`}
                            />
                        </div>

                        <button
                            onClick={downloadQR}
                            className="mt-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">
                            Download
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#111827] p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

                        <button className="w-full bg-green-700 hover:bg-green-600 py-2 rounded-lg mb-3"
                            onClick={() => {
                                setSelectedLink(link);
                                setEditOpen(true);
                            }}
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => { deleteLink(link._id) }}
                            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg">
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