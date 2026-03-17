import React, { useState, useEffect } from 'react'
import { IoLink } from "react-icons/io5";
import { MdQrCode2 } from "react-icons/md";
import { MdAdsClick } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoCopySharp } from "react-icons/io5";
import { RiEdit2Fill } from "react-icons/ri";
import EditLink from '../components/EditLink';
import { useLinks } from '../hooks/queries/useLinks.js';
import { useLinkStats } from '../hooks/queries/useLinkStats.js';
import { useDeleteLink } from "../hooks/mutations/useDeleteLink.js";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { IoClose } from "react-icons/io5";

const getLinkStatus = (link) => {
    if (link.status === "paused") return "paused";

    if (link.expiryDate && new Date(link.expiryDate) < new Date()) {
        return "expired";
    }

    return "active";
};

function Mylinks() {
    const navigate = useNavigate();
    const [deleteId, setDeleteId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const deleteMutation = useDeleteLink();
    const { data, isLoading } = useLinks(page);
    const { data: stats, isLoading: statsLoading } = useLinkStats();
    const links = data?.links || [];
    const pagination = data?.pagination;
    const [qrOpen, setQrOpen] = useState(false);
    const [qrUrl, setQrUrl] = useState("");

    const copyToClipboard = (shortUrl) => {
        navigator.clipboard.writeText(
            `${import.meta.env.VITE_BACKEND_URL}/${shortUrl}`
        );
    };

    const changePage = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage);
        setSearchParams(params);
    };

    const deleteLink = (id) => {
        deleteMutation.mutate(id);
    };

    const [editOpen, setEditOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);
    useEffect(() => {
        if (editOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [editOpen]);

    if (isLoading || statsLoading) {
        return <p className="text-white">Loading links...</p>;
    }
    return (
        <section className='text-white'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='flex flex-row items-center justify-between bg-[#1e293b62] p-8 rounded-2xl border-2 border-gray-800 overflow-hidden'>
                    <div className='flex flex-col items-center justify-between'>
                        <div className='bg-blue-600/20 py-4 px-3 rounded-lg'>
                            <IoLink size={25} className='text-blue-500' />
                        </div>
                        <h4 className=' text-gray-400 tracking-wider font-semibold'>Total Active Links</h4>
                    </div>
                    <h3 className='text-2xl sm:text-3xl md:text-4xl mb-2 font-semibold'>{stats?.totalActive ?? 0}</h3>
                </div>
                <div className='flex flex-row items-center justify-between bg-[#1e293b62] p-8 rounded-2xl border-2 border-gray-800 overflow-hidden'>
                    <div className='flex flex-col items-center justify-between'>
                        <div className='bg-violet-600/20 py-4 px-3 rounded-lg'>
                            <MdAdsClick size={25} className='text-violet-500' />
                        </div>
                        <h4 className=' text-gray-400 tracking-wider font-semibold'>Total Clicks </h4>
                    </div>
                    <h3 className='text-2xl sm:text-3xl md:text-4xl mb-2 font-semibold'>{stats?.totalClicks ?? 0}</h3>
                </div>
                <div className='flex flex-row items-center justify-between bg-[#1e293b62] p-8 rounded-2xl border-2 border-gray-800 overflow-hidden'>
                    <div className='flex flex-col items-center justify-between'>
                        <div className='bg-green-600/20 py-4 px-3 rounded-lg'>
                            <MdOutlinePersonOutline size={25} className='text-green-500' />
                        </div>
                        <h4 className=' text-gray-400 tracking-wider font-semibold'>Total Links</h4>
                    </div>
                    <h3 className='text-2xl sm:text-3xl md:text-4xl font-semibold'>{stats?.totalLinks ?? 0}</h3>
                </div>
            </div>
            <div className="bg-[#0f172a] rounded-xl mt-6 border border-[#1e293b] overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#111c2d] text-gray-400 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-left">Short URL & Original URL</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Total Clicks</th>
                                <th className="px-6 py-4 text-left">Unique Visitors</th>
                                <th className="px-6 py-4 text-left">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#1e293b]">
                            {links.length > 0 ? (
                                links.map((link) => {
                                    const computedStatus = getLinkStatus(link);
                                    return (
                                        <tr
                                            className={`transition hover:bg-[#0b1220] cursor-pointer ${computedStatus === "expired" ? "opacity-60" : ""
                                                }`}
                                            key={link._id}
                                            onClick={() => navigate(`/dashboard/links/${link._id}`)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-blue-400 font-medium flex gap-2.5">
                                                        <a
                                                            href={`${import.meta.env.VITE_BACKEND_URL}/${link.shortUrl}`}
                                                            target="_blank"
                                                            className="text-blue-400 cursor-pointer"
                                                        >
                                                            {link.shortUrl}
                                                        </a>
                                                        <IoCopySharp
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyToClipboard(link.shortUrl)
                                                            }}
                                                            className='text-gray-300 hover:text-blue-300' />
                                                    </span>
                                                    <span className="text-gray-500 text-xs truncate max-w-[280px]">
                                                        {link.originalUrl}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full ${computedStatus === "active"
                                                        ? "bg-emerald-500/20 text-emerald-400"
                                                        : computedStatus === "paused"
                                                            ? "bg-yellow-500/20 text-yellow-400"
                                                            : "bg-red-500/20 text-red-400"
                                                        }`}
                                                >
                                                    {computedStatus.toUpperCase()}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 font-semibold">{link.totalClicks}</td>
                                            <td className="px-6 py-4 text-gray-400">{link.totalUniqueVisitors}</td>
                                            <td className="px-6 py-4 text-gray-400">{new Date(link.createdAt).toLocaleDateString()}</td>

                                            <td className="flex my-5 gap-2 justify-center">
                                                <MdQrCode2
                                                    className="text-gray-400 hover:text-blue-400 cursor-pointer"
                                                    size={28}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setQrUrl(`${import.meta.env.VITE_BACKEND_URL}/${link.shortUrl}`);
                                                        setQrOpen(true);
                                                    }}
                                                />
                                                <RiEdit2Fill className="text-gray-400 hover:text-green-400" size={28}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedLink(link);
                                                        setEditOpen(true);
                                                    }} />
                                                <RiDeleteBin6Fill className="text-gray-400 hover:text-red-400" size={28}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteId(link._id);
                                                        setConfirmDelete(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-400">
                                        No links yet
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>
                <div className="md:hidden space-y-4 p-4">
                    {links.length > 0 ? (
                        links.map((link) => (
                            <div
                                key={link._id}
                                onClick={() => navigate(`/dashboard/links/${link._id}`)}
                                className="bg-[#111827] rounded-xl p-4 border border-[#1e293b] space-y-3">
                                <div>
                                    <p className="text-blue-400 font-medium flex flex-row gap-2">
                                        <a
                                            href={`${import.meta.env.VITE_BACKEND_URL}/${link.shortUrl}`}
                                            target="_blank"
                                            className="text-blue-400 cursor-pointer"
                                        >
                                            {link.shortUrl}
                                        </a>
                                        <IoCopySharp
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyToClipboard(link.shortUrl)
                                            }}
                                            className="text-gray-300 hover:text-blue-300 cursor-pointer"
                                        />
                                    </p>
                                    <p className="text-gray-500 text-xs truncate">
                                        {link.originalUrl}
                                    </p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Clicks</span>
                                    <span className="font-semibold">{link.totalClicks}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Unique</span>
                                    <span>{link.totalUniqueVisitors}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`px-3 py-1 text-xs rounded-full ${link.status === "active"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/20 text-red-400"
                                        }`}>
                                        {link.status.toUpperCase()}
                                    </span>
                                    <div className="space-x-2 text-lg flex flex-row">
                                        <MdQrCode2                                            className="text-blue-400 cursor-pointer"
                                            size={28}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setQrUrl(`${import.meta.env.VITE_BACKEND_URL}/${link.shortUrl}`);
                                                setQrOpen(true);
                                            }}
                                        />
                                        <RiEdit2Fill className="text-green-400 cursor-pointer" size={28} onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedLink(link);
                                            setEditOpen(true);
                                        }} />
                                        <RiDeleteBin6Fill className="text-red-400 cursor-pointer" size={28}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteId(link._id);
                                                setConfirmDelete(true)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))) : (
                        <p className="text-center text-gray-400">No links yet</p>
                    )}
                </div>
                {editOpen && (
                    <EditLink
                        link={selectedLink}
                        onClose={() => setEditOpen(false)}
                    />
                )}
                {qrOpen && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 text-center w-[320px]">

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-white font-semibold">QR Code</h2>
                                <IoClose
                                    className="text-gray-400 hover:text-white cursor-pointer"
                                    size={22}
                                    onClick={() => setQrOpen(false)}
                                />
                            </div>

                            <div className="bg-white p-4 rounded-lg inline-block">
                                <QRCodeCanvas
                                    id="qr-code"
                                    value={qrUrl}
                                    size={200}
                                    level="H"
                                />
                            </div>

                            <p className="text-gray-400 text-xs mt-3 break-all">
                                {qrUrl}
                            </p>

                            <button
                                onClick={() => {
                                    const canvas = document.getElementById("qr-code");
                                    const pngUrl = canvas
                                        .toDataURL("image/png")
                                        .replace("image/png", "image/octet-stream");

                                    const downloadLink = document.createElement("a");
                                    downloadLink.href = pngUrl;
                                    downloadLink.download = "qr-code.png";
                                    document.body.appendChild(downloadLink);
                                    downloadLink.click();
                                    document.body.removeChild(downloadLink);
                                }}
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg cursor-pointer"
                            >
                                Download QR
                            </button>
                        </div>
                    </div>
                )}
                {confirmDelete && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

                        <div className="bg-[#111827] p-6 rounded-xl w-[350px] text-center">

                            <h2 className="text-lg font-semibold mb-2">
                                Delete Link
                            </h2>

                            <p className="text-gray-400 text-sm mb-6">
                                Are you sure you want to delete this link?
                            </p>

                            <div className="flex justify-center gap-4">

                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        deleteLink(deleteId)
                                        setConfirmDelete(false);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
                                >
                                    Confirm
                                </button>

                            </div>

                        </div>
                    </div>
                )}
                <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-[#1e293b] bg-[#0f172a] text-sm text-gray-400 gap-4">
                    <span>Showing {links.length} of {pagination?.totalLinks || 0} links</span>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => changePage(page - 1)}
                            className="px-3 py-1 rounded-md bg-[#1e293b] hover:bg-[#334155] cursor-pointer">
                            {"<"}
                        </button>
                        {/* Page Numbers */}
                        {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => {
                            const pageNumber = i + 1;

                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => changePage(pageNumber)}
                                    className={`px-3 py-1 rounded-md cursor-pointer ${page === pageNumber
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-[#1e293b]"
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            disabled={page === pagination?.totalPages}
                            onClick={() => changePage(page + 1)}
                            className="px-3 py-1 rounded-md bg-[#1e293b] hover:bg-[#334155] cursor-pointer">
                            {">"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Mylinks