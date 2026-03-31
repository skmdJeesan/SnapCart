'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { IndianRupee, Package, Truck, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { getSocket } from '../lib/socket'

type propType = {
  earning: { today: number, sevenDays: number, total: number }
  stats: { title: string, value: number }[]
  chartData: { day: string, orders: number }[]
}

function AdminDashboard({ earning, stats, chartData }: propType) {
  const [filter, setFilter] = useState<'today' | 'sevenDays' | 'total'>()
  const curr_earning = ((filter === 'today') ? earning.today : ((filter === 'sevenDays') ? earning.sevenDays : earning.total))
  const title = ((filter === 'today') ? "Today's Earning" : ((filter === 'sevenDays') ? 'Last 7 days Earning' : 'Total Earning'))

  const userData = useSelector((state: RootState) => state.user.userData)

  useEffect(() => {
    if (userData?._id) {
      const socket = getSocket()
      socket.emit('identity', userData._id)
    }
  }, [userData?._id])

  return (
    <div className='pt-28 w-[90%] md:w-[80%] mx-auto'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 text-center sm:text-left'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-green-700"
        >🏪 Admin Dashboard
        </motion.h1>
        <select className='border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none transition w-full sm:w-auto cursor-pointer' value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="total">Total</option>
          <option value="sevenDays">Last 7 Days</option>
          <option value="today">Today</option>
        </select>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-green-200 shadow-sm rounded-3xl p-6 text-center mb-10"
      >
        <h2 className="text-lg font-semibold text-green-700 mb-2">{title}</h2>
        <p className="text-4xl font-extrabold text-green-800">{curr_earning.toLocaleString()}</p>
      </motion.div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        {stats.map((s, i) => {
          const icons = [
            <Package key="p" className="text-green-700 w-6 h-6" />,
            <Users key="u" className="text-green-700 w-6 h-6" />,
            <Truck key="t" className="text-green-700 w-6 h-6" />,
            <IndianRupee key="r" className="text-green-700 w-6 h-6" />,
          ]
          return <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg"
          >
            <div className='bg-green-100 p-3 rounded-xl'>{icons[i]}</div>
            <div>
              <p className='text-gray-600 text-sm'>{s.title}</p>
              <p className='text-2xl font-bold text-gray-800'>{s.value}</p>
            </div>
          </motion.div>
        })}
      </div>
      <div className='bg-white/75 rounded-3xl shadow-md p-5 mb-10'>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">📈 Orders Overview (Last 7 Days)</h2>
        <ResponsiveContainer height={300} width='100%'>
          <BarChart data={chartData}>
            <XAxis dataKey="day" />
            <Tooltip />
            <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
            <Bar dataKey='orders' fill='#16A34A' radius={[6, 6, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div >
  )
}

export default AdminDashboard