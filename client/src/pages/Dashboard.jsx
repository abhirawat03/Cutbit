import React, { useState, useEffect } from 'react'
import { IoLink } from "react-icons/io5";
import { ChartLine } from '../components/ChartLine';
import { GiAlliedStar } from "react-icons/gi";
import { MdAdsClick } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import Api from '../api/axios';
import { Link } from 'react-router-dom';


function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);

  const fetchDashboard = async (selectedRange) => {
    try {

      const res = await Api.get(`/dashboard/stats?range=${selectedRange}`);

      setDashboard(res.data.data);
      // console.log(dashboard)

    } catch (error) {
      console.error("Dashboard fetch error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard(range);
  }, [range]);
  if (loading) {
    return <p className="text-white">Loading dashboard...</p>;
  }
  return (
    <section className='text-white'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-gradient-to-br from-blue-900/60 to-[#1e293b62] p-8 rounded-2xl border-2 border-blue-900 relative overflow-hidden'>
          <div className='flex items-center mb-5 justify-between'>
            <h2 className='uppercase text-xl font-bold tracking-widest text-blue-600'>Total Engagement</h2>
            <div className='bg-blue-600/40 py-4 px-3 rounded-lg'>
              <IoLink size={25} className='text-blue-500' />
            </div>
          </div>
          <div >
            <h1 className='text-3xl sm:text-4xl md:text-5xl mb-2 font-extrabold'>{dashboard.stats.totalLinks}</h1>
            <span>
              {/* +12.5% vs {range}D */}
            </span>
          </div>
          <IoLink className='absolute bottom-0 -right-4 text-gray-700' size={120} />
        </div>
        <div className='bg-gradient-to-br from-violet-900/60 to-[#1e293b62] p-8 rounded-2xl border-2 border-violet-900 relative overflow-hidden'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='uppercase text-xl font-bold tracking-widest text-violet-600'>Activity Reach</h2>
            <div className='bg-violet-600/40 py-4 px-3 rounded-lg'>
              <MdAdsClick size={25} className='text-violet-500' />
            </div>
          </div>
          <div>
            <h1 className='text-5xl font-extrabold mb-2'>{dashboard.stats.lifetimeClicks}</h1>
            <span>
              {dashboard.growth.clicks}% vs {range}D
            </span>
          </div>
          <MdAdsClick className='absolute bottom-0 -right-4 text-gray-700' size={120} />
        </div>
        <div className='bg-gradient-to-br from-green-900/60 to-[#1e293b62] p-8 rounded-2xl border-2 border-green-900 relative overflow-hidden'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='uppercase text-xl font-bold tracking-widest text-green-600'>Unique Influence</h2>
            <div className='bg-green-600/40 py-4 px-3 rounded-lg'>
              <MdOutlinePersonOutline size={25} className='text-green-500' />
            </div>
          </div>
          <div>
            <h1 className='text-5xl font-extrabold mb-2'>{dashboard.stats.lifetimeUnique}</h1>
            <span>
              {dashboard.growth.unique}% vs {range}D
            </span>
          </div>
          <MdOutlinePersonOutline className='absolute bottom-0 -right-4 text-gray-700' size={120} />
        </div>
      </div>
      <div className="flex gap-3 mb-4">

        <button
          onClick={() => setRange(7)}
          className={`px-4 py-2 rounded-lg ${range === 7 ? "bg-blue-600" : "bg-[#40444a6d]"
            }`}
        >
          7D
        </button>

        <button
          onClick={() => setRange(30)}
          className={`px-4 py-2 rounded-lg ${range === 30 ? "bg-blue-600" : "bg-[#40444a6d]"
            }`}
        >
          30D
        </button>

        <button
          onClick={() => setRange(90)}
          className={`px-4 py-2 rounded-lg ${range === 90 ? "bg-blue-600" : "bg-[#40444a6d]"
            }`}
        >
          90D
        </button>

      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
        <div className='md:col-span-2 rounded-2xl'>
          <ChartLine data={dashboard?.chart || []} range={range} />
        </div>
        <div className='p-6 bg-[#33373d55] rounded-2xl flex flex-col border'>
          <div className='flex mb-8 items-center gap-3'>
            <GiAlliedStar className='text-orange-400' size={28} />
            <h1 className='text-xl text-gray-300 font-bold'>
              Top Performing Link
            </h1>
          </div>
          {dashboard?.topLink ? (
            <>
              <p>{dashboard.topLink.name}</p>
              <h3 className='text-2xl text-blue-500 font-bold'>{dashboard.topLink.shortUrl}</h3>
              <div className='grid grid-cols-2 mt-7 gap-5'>
                <div className='bg-[#40444a6d] py-3 px-4 rounded-xl space-y-2'>
                  <h3 className='text-xs tracking-widest font-bold text-gray-400'>{dashboard.topLink.clicks}</h3>
                  <p className='text-2xl font-bold'>12405</p>
                </div>
                <div className='bg-[#40444a6d] py-3 px-4 rounded-xl space-y-2'>
                  <h3 className='text-xs tracking-widest font-bold text-gray-400'>{dashboard.topLink.uniqueVisitors}</h3>
                  <p className='text-2xl font-bold'>2546</p>
                </div>
              </div>
              <button className='bg-[#40444a6d] text-xl font-bold py-2 px-4 rounded-xl mt-8 md:mt-20 hover:bg-[#33383ea4]'>View Full Report</button>
            </>
          ) : (
            <p className='text-center mt-25 text-2xl font-bold'>No Data</p>
          )
          }
        </div>
      </div>
      <div className='grid mt-6 bg-[#33373d55] rounded-xl border border-[#334155]'>
        <div className='flex flex-row justify-between items-center p-6'>
          <h2 className='text-2xl font-medium'>Recent 5 Links</h2>
          <Link to="/dashboard/links">
            <button className="text-blue-500 hover:text-blue-300 text-base">View All</button>
          </Link>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[700px] text-sm'>
            <thead className="text-left text-gray-300 uppercase text-xs sm:text-sm bg-[#23293891] tracking-widest">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Link</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Target</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Clicks</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#334155]'>
              {dashboard?.recentLinks?.length > 0 ? (
                <>
                  {dashboard.recentLinks.map((link) => (
                    <tr
                      className="hover:bg-[#0f172a]/40 transition"
                      key={link._id}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {link.name}
                          </span>
                          <span className="text-blue-500 text-sm">
                            {link.shortUrl}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-400 truncate max-w-[250px]">
                        {link.originalUrl}
                      </td>

                      <td className="px-6 py-4 text-right font-semibold">
                        {link.totalClicks}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 text-xs rounded-md bg-emerald-500/20 text-emerald-400">
                          {link.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-xl py-6 text-gray-400">
                    No Links Yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Dashboard