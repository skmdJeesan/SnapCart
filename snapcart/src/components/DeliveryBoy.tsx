import React from 'react'
import DeliveryBoyDashboard from './DeliveryBoyDashboard'
import { auth } from '../auth'
import GeoLocationUpdater from './GeoLocationUpdater'
import connectDB from '../lib/db'
import Order from '../models/order.model'

async function DeliveryBoy() {
  await connectDB()
  const session = await auth()
  const deliveryBoyId = session?.user?.id
  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryOtpVerification: true,
  })

  const today = new Date().toDateString()
  const todayOrders = orders.filter((o) => new Date(o.deliveredAt).toDateString() === today).length
  const todaysEarning = todayOrders * 40

  const lastSevenDaysOrders = orders.filter((o) => new Date(o.deliveredAt).toDateString() >= today).length
  const lastSevenDaysEearning = lastSevenDaysOrders * 40

  const totalEarning = orders.length * 40
  return (
    <div className='w-full min-h-screen'>
      <GeoLocationUpdater userId={session?.user?.id as string} />
      <DeliveryBoyDashboard 
        earning={todaysEarning}
      />
    </div>
  )
}

export default DeliveryBoy