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

function Mylinks() {

    const copyToClipboard = (shortUrl) => {
        navigator.clipboard.writeText(shortUrl);
        alert('Copied!')
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
    return (
        <section className='text-white'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-[#1e293b62] p-8 rounded-2xl border-2 border-gray-800 relative overflow-hidden'>
                    <div className='flex items-center mb-5 justify-between'>
                        <div className='bg-blue-600/20 py-4 px-3 rounded-lg'>
                            <IoLink size={25} className='text-blue-500' />
                        </div>
                        <p>+12.5%</p>
                    </div>
                    <h4 className='mb-2 text-gray-400 tracking-wider font-semibold'>Total Active Links</h4>
                    <h3 className='text-2xl sm:text-3xl md:text-4xl mb-2 font-semibold'>1284</h3>
                </div>
                <div className='bg-[#1e293b62] p-8 rounded-2xl border-2 border-gray-800 relative overflow-hidden'>
                    <div className='flex items-center justify-between mb-5'>
                        <div className='bg-violet-600/20 py-4 px-3 rounded-lg'>
                            <MdAdsClick size={25} className='text-violet-500' />
                        </div>
                        <p>+12.5%</p>
                    </div>
                    <h4 className='mb-2 text-gray-400 tracking-wider font-semibold'>Total Active Links</h4>
                    <h3 className='text-2xl sm:text-3xl md:text-4xl mb-2 font-semibold'>1284</h3>
                </div>
                <div className='bg-[#1e293b62] p-8 rounded-2xl border-2 border-gray-800 relative overflow-hidden'>
                    <div className='flex items-center justify-between mb-5'>
                        <div className='bg-green-600/20 py-4 px-3 rounded-lg'>
                            <MdOutlinePersonOutline size={25} className='text-green-500' />
                        </div>
                        <p>+12.5%</p>
                    </div>
                    <h4 className='mb-2 text-gray-400 tracking-wider font-semibold'>Total Active Links</h4>
                    <h3 className='text-2xl sm:text-3xl md:text-4xl mb-2 font-semibold'>1284</h3>
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
                            <tr className="hover:bg-[#0b1220] transition">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-blue-400 font-medium flex gap-2.5">
                                            Inky.sh/summer24
                                            <IoCopySharp onClick={copyToClipboard} className='text-gray-300 hover:text-blue-300' />
                                        </span>
                                        <span className="text-gray-500 text-xs truncate max-w-[280px]">
                                            https://store.example.com/collections/summer...
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                                        ACTIVE
                                    </span>
                                </td>

                                <td className="px-6 py-4 font-semibold">12,402</td>
                                <td className="px-6 py-4 text-gray-400">8,912</td>
                                <td className="px-6 py-4 text-gray-400">May 12, 2024</td>

                                <td className="py-4 text-right space-x-3 flex items-center">
                                    <MdQrCode2 className="text-gray-400 hover:text-blue-400" size={28} />
                                    <RiEdit2Fill className="text-gray-400 hover:text-green-400" size={28}
                                        onClick={() => {
                                            setSelectedLink({
                                                originalUrl: "https://store.example.com/collections/summer",
                                                shortCode: "summer24",
                                                status: "active",
                                            });
                                            setEditOpen(true);
                                        }} />
                                    <MdAnalytics className="text-gray-400 hover:text-yellow-400" size={28} />
                                    <RiDeleteBin6Fill className="text-gray-400 hover:text-red-400" size={28} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="md:hidden space-y-4 p-4">
                    <div className="bg-[#111827] rounded-xl p-4 border border-[#1e293b] space-y-3">
                        <div>
                            <p className="text-blue-400 font-medium">
                                Inky.sh/summer24
                            </p>
                            <p className="text-gray-500 text-xs truncate">
                                https://store.example.com/collections/summer...
                            </p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Clicks</span>
                            <span className="font-semibold">12,402</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Unique</span>
                            <span>8,912</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                                ACTIVE
                            </span>
                            <div className="space-x-2 text-lg flex flex-row">
                                <MdQrCode2 className=" text-blue-400" size={28} />
                                <RiEdit2Fill className=" text-green-400" size={28} onClick={() => {
                                    setSelectedLink({
                                        originalUrl: "https://store.example.com/collections/summer",
                                        shortCode: "summer24",
                                        status: "active",
                                    });
                                    setEditOpen(true);
                                }} />
                                <MdAnalytics className="text-yellow-400" size={28} />
                                <RiDeleteBin6Fill className="text-red-400" size={28} />
                            </div>
                        </div>
                    </div>
                </div>
                {editOpen && (
                    <EditLink
                        link={selectedLink}
                        onClose={() => setEditOpen(false)}
                    />
                )}
                <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-[#1e293b] bg-[#0f172a] text-sm text-gray-400 gap-4">
                    <span>Showing 1 to 3 of 128 links</span>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded-md bg-[#1e293b] hover:bg-[#334155]">
                            {"<"}
                        </button>

                        <button className="px-3 py-1 rounded-md bg-blue-600 text-white">
                            1
                        </button>

                        <button className="px-3 py-1 rounded-md hover:bg-[#1e293b]">
                            2
                        </button>

                        <button className="px-3 py-1 rounded-md hover:bg-[#1e293b]">
                            3
                        </button>

                        <span>...</span>

                        <button className="px-3 py-1 rounded-md hover:bg-[#1e293b]">
                            42
                        </button>

                        <button className="px-3 py-1 rounded-md bg-[#1e293b] hover:bg-[#334155]">
                            {">"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Mylinks