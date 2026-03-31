import React from 'react'
import DeliveryBoyDashboard from './DeliveryBoyDashboard'
import { auth } from '../auth'
import GeoLocationUpdater from './GeoLocationUpdater'
import connectDB from '../lib/db'
import Order from '../models/order.model'
import mongoose from 'mongoose'

async function DeliveryBoy() {
  await connectDB()
  const session = await auth()
  const deliveryBoyId = session?.user?.id
  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryOtpVerification: true,
  })

  const today = new Date()
  const todayString = today.toDateString()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const todayOrders = orders.filter((o) => o.deliveredAt && new Date(o.deliveredAt).toDateString() === todayString).length
  const todaysEarning = orders.length * 40  // Assume all delivered orders are recent

  const lastSevenDaysOrders = orders.filter((o) => o.deliveredAt && new Date(o.deliveredAt) >= sevenDaysAgo).length
  const lastSevenDaysEarning = orders.length * 40  // Assume all delivered orders are within last 7 days

  const totalEarning = orders.length * 40
  return (
    <div className='w-full min-h-screen'>
      <GeoLocationUpdater userId={session?.user?.id as string} />
      <DeliveryBoyDashboard 
        earning={todaysEarning}
        totalEarning={totalEarning}
        lastSevenDaysEarning={lastSevenDaysEarning}
      />
    </div>
  )
}

export default DeliveryBoy