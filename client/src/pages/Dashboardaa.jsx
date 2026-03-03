import { useEffect, useState } from "react";
import Api from "../api/axios";

function Dashboardaa() {
    const [stats, setStats] = useState({});
    const [links, setLinks] = useState([]);

    const fetchData = async () => {
        try {
            const statsRes = await Api.get("/stats");
            const linksRes = await Api.get("/links");
            console.log(statsRes.data.data)
            console.log(linksRes.data.data)
            setStats(statsRes.data.data);
            setLinks(linksRes.data.data);
        } catch (err) {
            alert("Error loading dashboard", err)
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [])

    const deleteLink = async (id) => {
        try {
            await Api.delete(`/link/${id}`);
            fetchData();
        } catch (error) {
            alert("delete failed", error)
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500">Total Links</p>
                    <h2 className="text-3xl font-bold">{stats.totalLinks || 0}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500">Total Clicks</p>
                    <h2 className="text-3xl font-bold">{stats.totalClicks || 0}</h2>
                </div>
            </div>

            {/* Links Table */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">All Links</h2>

                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2">Short</th>
                            <th>Original</th>
                            <th>Clicks</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {links.map((link) => (
                            <tr key={link._id} className="border-b">
                                <td className="py-2 text-indigo-600">
                                    <a href={`http://localhost:8000/${link.shortUrl}`} target="_blank">
                                        {link.shortUrl}
                                    </a>
                                </td>
                                <td className="truncate max-w-75">{link.originalUrl}</td>
                                <td>{link.clicks}</td>
                                <td>
                                    <button
                                        onClick={() => deleteLink(link._id)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>

    )
}   

export default Dashboardaa