import React, { useState, useEffect } from 'react'
import { IoLink } from "react-icons/io5";
import { MdAnalytics } from "react-icons/md";
import { MdQrCode2 } from "react-icons/md";
import { MdAdsClick } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoCopySharp } from "react-icons/io5";
import { RiEdit2Fill } from "react-icons/ri";
import EditLink from '../components/EditLink';
import Api from '../api/axios';

function Mylinks() {
    const [links, setLinks] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);

    const fetchLinks = async () => {
        try {
            setLoading(true);

            const res = await Api.get("/links?page=${currentPage}");
            const res1 = await Api.get("/stats")
            setStats(res1.data.data)
            console.log(res1.data.data);
            setLinks(res.data.data.links);
            setPagination(res.data.data.pagination);
            setPage(res.data.data.pagination.page);
            console.log(res.data.data);
        } catch (error) {
            console.error("Failed to fetch links", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchLinks(page);
    }, [page]);

    const copyToClipboard = (shortUrl) => {
        navigator.clipboard.writeText(
            `${import.meta.env.VITE_BACKEND_URL_ID}/${shortUrl}`
        );
        alert("Copied!");
    };

    const deleteLink = async (id) => {
        try {
            await Api.delete(`/links/${id}`);

            setLinks((prev) => prev.filter((link) => link._id !== id));
        } catch (error) {
            console.error("Delete failed", error);
        }
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

    if (loading) {
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
                    <h3 className='text-2xl sm:text-3xl md:text-4xl mb-2 font-semibold'>{stats.totalActive}</h3>
                </div>
                <div className='flex flex-row items-center justify-between bg-[#1e293b62] p-8 rounded-2xl border-2 border-gray-800 overflow-hidden'>
                    <div className='flex flex-col items-center justify-between'>
                        <div className='bg-violet-600/20 py-4 px-3 rounded-lg'>
                            <MdAdsClick size={25} className='text-violet-500' />
                        </div>
                        <h4 className=' text-gray-400 tracking-wider font-semibold'>Total Clicks </h4>
                    </div>
                    <h3 className='text-2xl sm:text-3xl md:text-4xl mb-2 font-semibold'>{stats.totalClicks}</h3>
                </div>
                <div className='flex flex-row items-center justify-between bg-[#1e293b62] p-8 rounded-2xl border-2 border-gray-800 overflow-hidden'>
                    <div className='flex flex-col items-center justify-between'>
                        <div className='bg-green-600/20 py-4 px-3 rounded-lg'>
                            <MdOutlinePersonOutline size={25} className='text-green-500' />
                        </div>
                        <h4 className=' text-gray-400 tracking-wider font-semibold'>Total Links</h4>
                    </div>
                    <h3 className='text-2xl sm:text-3xl md:text-4xl font-semibold'>{stats.totalLinks}</h3>
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
                                links.map((link) => (
                                    <tr key={link._id} className="hover:bg-[#0b1220] transition">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-blue-400 font-medium flex gap-2.5">
                                                    <a
                                                        href={`${import.meta.env.VITE_BACKEND_URL_ID}/${link.shortUrl}`}
                                                        target="_blank"
                                                        className="text-blue-400 cursor-pointer"
                                                    >
                                                        {link.shortUrl}
                                                    </a>
                                                    <IoCopySharp onClick={() => copyToClipboard(link.shortUrl)} className='text-gray-300 hover:text-blue-300' />
                                                </span>
                                                <span className="text-gray-500 text-xs truncate max-w-[280px]">
                                                    {link.originalUrl}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                                                {link.status.toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 font-semibold">{link.totalClicks}</td>
                                        <td className="px-6 py-4 text-gray-400">{link.totalUniqueVisitors}</td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(link.createdAt).toLocaleDateString()}</td>

                                        <td className="py-4 text-right space-x-3 flex items-center">
                                            <MdQrCode2 className="text-gray-400 hover:text-blue-400" size={28} />
                                            <RiEdit2Fill className="text-gray-400 hover:text-green-400" size={28}
                                                onClick={() => {
                                                    setSelectedLink(link);
                                                    setEditOpen(true);
                                                }} />
                                            <MdAnalytics className="text-gray-400 hover:text-yellow-400" size={28} />
                                            <RiDeleteBin6Fill className="text-gray-400 hover:text-red-400" size={28}
                                                onClick={() => deleteLink(link._id)}
                                            />
                                        </td>
                                    </tr>
                                ))
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
                                className="bg-[#111827] rounded-xl p-4 border border-[#1e293b] space-y-3">
                                <div>
                                    <p className="text-blue-400 font-medium flex flex-row gap-2">
                                        <a
                                            href={`${import.meta.env.VITE_BACKEND_URL_ID}/${link.shortUrl}`}
                                            target="_blank"
                                            className="text-blue-400 cursor-pointer"
                                        >
                                            {link.shortUrl}
                                        </a>
                                        <IoCopySharp
                                            onClick={() => copyToClipboard(link.shortUrl)}
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
                                    <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                                        {link.status.toUpperCase()}
                                    </span>
                                    <div className="space-x-2 text-lg flex flex-row">
                                        <MdQrCode2 className=" text-blue-400" size={28} />
                                        <RiEdit2Fill className=" text-green-400" size={28} onClick={() => {
                                            setSelectedLink(link);
                                            setEditOpen(true);

                                        }} />
                                        <MdAnalytics className="text-yellow-400" size={28} />
                                        <RiDeleteBin6Fill className="text-red-400" size={28}
                                            onClick={() => deleteLink(link._id)}
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
                <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-[#1e293b] bg-[#0f172a] text-sm text-gray-400 gap-4">
                    <span>Showing {links.length} of {pagination?.totalLinks} links</span>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 rounded-md bg-[#1e293b] hover:bg-[#334155]">
                            {"<"}
                        </button>
                        {/* Page Numbers */}
                        {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => {
                            const pageNumber = i + 1;

                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setPage(pageNumber)}
                                    className={`px-3 py-1 rounded-md ${page === pageNumber
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
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 rounded-md bg-[#1e293b] hover:bg-[#334155]">
                            {">"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Mylinks