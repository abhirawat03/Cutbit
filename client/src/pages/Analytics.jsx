import React from 'react'
import { ChartBar } from '../components/ChartBar'
import { ChartLineb } from '../components/ChartLineb'
import ChartPie  from '../components/ChartPie'

function Analytics() {
    return (
        <section>
            <div className='grid md:grid-cols-3 grid-cols-1 gap-5'>
                <div className='bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 space-y-5'>
                    <div className='flex flex-row justify-between text-2xl'>
                        <h3 className='text-gray-400'>Total Clicks</h3>
                        <p>+12.3%</p>
                    </div>
                    <h2 className='text-5xl'>124.5K</h2>
                </div>
                <div className='bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 space-y-5'>
                    <div className='flex flex-row justify-between text-2xl'>
                        <h3 className='text-gray-400'>Unique Visitor</h3>
                        <p>-2.5%</p>
                    </div>
                    <h2 className='text-5xl'>84.1K</h2>
                </div>
                <div className='bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 space-y-5'>
                    <div className='flex flex-row justify-between text-2xl'>
                        <h3 className='text-gray-400'>Total Links</h3>
                        <p>+4.2%</p>
                    </div>
                    <h2 className='text-5xl'>1284</h2>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-5 gap-5'>
                <ChartBar/>
                <ChartLineb/>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 mt-5 gap-5'>
                <ChartPie/>
                <div className='bg-[#0f172a] border border-[#1e293b] text-white rounded-xl p-7'>
                    <div className='flex flex-col gap-2 '>
                        <h2 className='text-2xl font-semibold'>Top Performing Links</h2>
                        <p className='text-lg text-gray-400'>Highest engagement by individual URL</p>
                    </div>
                </div>
                <div className='bg-[#0f172a] border border-[#1e293b] text-white rounded-xl p-7'>
                    <div className='flex flex-col gap-2 '>
                        <h2 className='text-2xl font-semibold'>Top Countries</h2>
                        <p className='text-lg text-gray-400'>Traffic distribution by geographic location</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Analytics