'use client'
import { motion } from 'framer-motion'

import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, PhoneIcon, Truck, TruckIcon, UserCheck2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getSocket } from '../lib/socket'
import { IUser } from '../models/user.model'
import { useRouter } from 'next/navigation'

interface IOrder {
  _id?: string;
  userId: string;
  items: [
    {
      groceryId: string;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    }
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  status: "pending" | "out for delivery" | "delivered" | "cancelled";
  address: {
    name: string;
    mobile: string;
    fullAddress: string;
    city: string;
    state: string;
    pinCode: string;
    latitude: number;
    longitude: number;
  };
  assignment?: string
  assignedDeliveryBoy?: IUser
  createdAt?: Date;
  updatedAt?: Date;
}

const UserOrderCard = ({ order }: { order: IOrder }) => {
  const router = useRouter()
  const [expanded, setExpanded] = useState<boolean>(false)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'out for delivery': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'delivered': return 'bg-green-100 text-green-700 border-green-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }

  const [status, setStatus] = useState(order.status)
  useEffect((): any => {
    const socket = getSocket()
    socket.on('order-status-update', (data) => {
      if (data.orderId.toString() == order._id?.toString())
        setStatus(data.status)
    })
    return () => socket.off('order-status-update')
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition overflow-hidden mb-3'
    >
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-green-50 to-white'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>
            order <span className='text-green-700 font-bold'>#{order?._id?.toString()?.slice(-6)}</span>
          </h3>
          <p className='text-xs text-gray-500 mt-1'>{new Date(order.createdAt!).toLocaleString()}</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          {status !== 'delivered' && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${order.isPaid ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
              {order.isPaid ? "Paid" : "Unpaid"}
            </span>
          )}
          <span
            className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(status)}`}
          >
            {status}
          </span>
        </div>
      </div>
      {status !== 'delivered' && (
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <CreditCard size={16} className='text-green-600' />
            {order.paymentMethod === 'cod' ? "Cash on delivery" : "Online payment"}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin size={16} className='text-green-600' />
            <span className="truncate">{order.address.fullAddress}</span>
          </div>
          {order.assignedDeliveryBoy && <>
            <div className="mt-3 bg-blue-100 p-4 rounded-3xl relative">
              <div className="flex gap-2 items-center mb-1">
                <UserCheck2 className='text-blue-600' size={18} />
                <p className='text-gray-500'>Assigned Delivery Boy: {order.assignedDeliveryBoy.name}</p>
              </div>
              <div className="flex gap-2 items-center">
                <PhoneIcon className='text-blue-600' size={18} />
                <p className="text-gray-500">Contact: +91 {order.assignedDeliveryBoy.mobile}</p>
              </div>
              <div className='sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 mt-4 sm:mt-0'>
                <a href={`tel:${order.assignedDeliveryBoy.mobile}`} className="bg-blue-500 rounded-xl cursor-pointer hover:bg-blue-600 py-2 px-5 text-white font-semiblod">Call Now</a>
              </div>
            </div>
            <button
              onClick={() => router.push(`/user/track-order/${order._id?.toString()}`)}
              className="w-full sm:w-fit flex gap-2 items-center justify-center text-white font-semibold bg-yellow-500 hover:bg-yellow-600 cursor-pointer rounded-2xl py-2 px-5">
              <TruckIcon /> Track Your Order
            </button>
          </>}
          <div className="border-t border-gray-200 pt-3">
            <button
              onClick={() => setExpanded(prev => !prev)}
              className='w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-green-700 transition cursor-pointer'
            >
              <span className="flex items-center gap-2">
                <Package size={16} className='text-green-600' />
                {expanded ? 'Hide order items' : `view ${order.items.length} items`}
              </span>
              {expanded ? <ChevronUp size={20} className='text-green-600' /> : <ChevronDown size={20} className='text-green-600' />}
            </button>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: expanded ? 1 : 0, height: expanded ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
              className='overflow-hidden'
            >
              <div className="mt-3 space-x-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-4">
                      <Image src={item.image} alt={item.name} height={48} width={48} className='rounded-lg object-cover border border-gray-200 ' />
                      <div className="">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} x {item.unit}</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 font-semibold">Price: ₹{item.quantity * Number(item.price)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Truck size={16} className='text-green-600' />
              <span>
                Delivery: <span className='text-green-700 font-semibold'>{status}</span>
              </span>
            </div>
            <div className="">
              Total: <span className='text-green-700 font-bold'>₹{order.totalAmount}</span>
            </div>
          </div>

        </div>
      )}

    </motion.div>
  )
}

export default UserOrderCard