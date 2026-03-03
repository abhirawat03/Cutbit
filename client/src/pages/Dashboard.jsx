import React from 'react'
import { IoLink } from "react-icons/io5";
import { ChartLine } from '../components/ChartLine';
import { GiAlliedStar } from "react-icons/gi";
import { MdAdsClick } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";

function Dashboard() {
  return (
    <section className='text-white'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-gradient-to-br from-blue-900/60 to-[#1e293b62] p-8 rounded-2xl border-2 border-blue-900 relative overflow-hidden'>
          <div className='flex items-center mb-5 justify-between'>
            <h2 className='uppercase text-xl font-bold tracking-widest text-blue-600'>Total Engagement</h2>
            <div className='bg-blue-600/40 py-4 px-3 rounded-lg'>
              <IoLink size={25} className='text-blue-500'/>
            </div>
          </div>
          <div >
            <h1 className='text-3xl sm:text-4xl md:text-5xl mb-2 font-extrabold'>1284</h1>
            <span>
              +12.5% vs last month
            </span>
          </div>
          <IoLink className='absolute bottom-0 -right-4 text-gray-700' size={120}/>
        </div>
        <div className='bg-gradient-to-br from-violet-900/60 to-[#1e293b62] p-8 rounded-2xl border-2 border-violet-900 relative overflow-hidden'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='uppercase text-xl font-bold tracking-widest text-violet-600'>Total Engagement</h2>
            <div className='bg-violet-600/40 py-4 px-3 rounded-lg'>
              <MdAdsClick size={25} className='text-violet-500'/>
            </div>
          </div>
          <div>
            <h1 className='text-5xl font-extrabold mb-2'>1284</h1>
            <span>
              +12.5% vs last month
            </span>
          </div>
          <MdAdsClick className='absolute bottom-0 -right-4 text-gray-700' size={120}/>
        </div>
        <div className='bg-gradient-to-br from-green-900/60 to-[#1e293b62] p-8 rounded-2xl border-2 border-green-900 relative overflow-hidden'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='uppercase text-xl font-bold tracking-widest text-green-600'>Total Engagement</h2>
            <div className='bg-green-600/40 py-4 px-3 rounded-lg'>
              <MdOutlinePersonOutline size={25} className='text-green-500'/>
            </div>
          </div>
          <div>
            <h1 className='text-5xl font-extrabold mb-2'>1284</h1>
            <span>
              +12.5% vs last month
            </span>
          </div>
          <MdOutlinePersonOutline className='absolute bottom-0 -right-4 text-gray-700' size={120}/>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
        <div className='md:col-span-2 rounded-2xl'>
          <ChartLine />
        </div>
        <div className='p-6 bg-[#33373d55] rounded-2xl flex flex-col border'>
          <div className='flex mb-8 items-center gap-3'>
            <GiAlliedStar className='text-orange-400' size={28}/>
            <h1 className='text-xl text-gray-300 font-bold'>
              Top Performing Link
            </h1>
          </div>
          <p>Instagram Bio Link</p>
          <h3 className='text-2xl text-blue-500 font-bold'>flow.ly/bio-ig</h3>
          <div className='grid grid-cols-2 mt-7 gap-5'>
            <div className='bg-[#40444a6d] py-3 px-4 rounded-xl space-y-2'>
              <h3 className='text-xs tracking-widest font-bold text-gray-400'>CLICKS</h3>
              <p className='text-2xl font-bold'>12405</p>
            </div>
            <div className='bg-[#40444a6d] py-3 px-4 rounded-xl space-y-2'>
              <h3 className='text-xs tracking-widest font-bold text-gray-400'>UNIQUE CLICKS</h3>
              <p className='text-2xl font-bold'>2546</p>
            </div>
          </div>
          <button className='bg-[#40444a6d] text-xl font-bold py-2 px-4 rounded-xl mt-8 md:mt-20 hover:bg-[#33383ea4]'>View Full Report</button>
        </div>
      </div>
      <div className='grid mt-6 bg-[#33373d55] rounded-xl border border-[#334155]'>
        <div className='flex flex-row justify-between items-center p-6'>
          <h2 className='text-2xl font-medium'>Recent 5 Links</h2>
          <button className='text-blue-500 text-base'>View All</button>
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
              <tr className="">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      Summer Campaign 2024
                    </span>
                    <span className="text-blue-500 text-sm">
                      flow.ly/sum24
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-400 truncate max-w-[250px]">
                  https://myshop.com/promo/summer...
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  4,281
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="px-3 py-1 text-xs rounded-md bg-emerald-500/20 text-emerald-400">
                    ACTIVE
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#0f172a]/40 transition">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      Summer Campaign 2024
                    </span>
                    <span className="text-blue-500 text-sm">
                      flow.ly/sum24
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-400 truncate max-w-[250px]">
                  https://myshop.com/promo/summer...
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  4,281
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="px-3 py-1 text-xs rounded-md bg-emerald-500/20 text-emerald-400">
                    ACTIVE
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#0f172a]/40 transition">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      Summer Campaign 2024
                    </span>
                    <span className="text-blue-500 text-sm">
                      flow.ly/sum24
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-400 truncate max-w-[250px]">
                  https://myshop.com/promo/summer...
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  4,281
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="px-3 py-1 text-xs rounded-md bg-emerald-500/20 text-emerald-400">
                    ACTIVE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Dashboard