'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, PhoneCall, PhoneIcon, Truck, User, UserCheck2 } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import { div } from 'motion/react-client'
import { IUser } from '../models/user.model'
import { getSocket } from '../lib/socket'

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

function AdminOrderCard({ order }: { order: IOrder }) {
  const [expanded, setExpanded] = useState<boolean>(false)

  const statusOptions = ['pending', 'out for delivery']
  const [status, setStatus] = useState<string>('pending')
  useEffect(() => { setStatus(order.status) }, [order])
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      // send a JSON object so the API can destructure correctly
      const res = await axios.post(`/api/admin/update-order-status/${orderId}`, { status: newStatus })
      console.log(res.data)
      setStatus(newStatus)
    } catch (error) {
      console.log(error)
    }
  }

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
      className='bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all mb-3'
    >
      <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4 w-full'>
        <div className='space-y-2'>
          <p className='text-lg font-bold flex items-center gap-2 text-green-700'>
            <Package size={20} />
            Order #{order._id?.toString().slice(-6)}
          </p>
          {status !== 'delivered' && (
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${order.isPaid ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'
              }`}>
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          )}
          <p className='text-gray-500 text-sm'>{new Date(order.createdAt!).toLocaleString()}</p>
          <div className="mt-3 space-y-1 text-sm text-gray-700">
            <p className='flex items-center gap-2 font-semibold'>
              <User size={16} className='text-green-600' />
              <span>{order.address.name}</span>
            </p>
            <p className='flex items-center gap-2 font-semibold'>
              <Phone size={16} className='text-green-600' />
              <span>{order.address.mobile}</span>
            </p>
            <p className='flex items-center gap-2 font-semibold'>
              <MapPin size={16} className='text-green-600' />
              <span>{order.address.fullAddress}</span>
            </p>
          </div>
          <p className='mt-3 flex items-center gap-2 text-sm text-gray-700'>
            <CreditCard size={16} className='text-green-600' />
            <span>{order.paymentMethod == 'cod' ? "Cash On Delivery" : "Online Payment"}</span>
          </p>
          {order.assignedDeliveryBoy && (
            <div className="mt-3 bg-blue-100 p-4 rounded-3xl relative">
              <div className="flex gap-2 items-center mb-1">
                <UserCheck2 className='text-blue-600' size={18} />
                <p className='text-gray-500'>Assigned Delivery Boy: {order.assignedDeliveryBoy.name}</p>
              </div>
              <div className="flex gap-2 items-center">
                <PhoneIcon className='text-blue-600' size={18} />
                <p className="text-gray-500">Contact: +91 {order.assignedDeliveryBoy.mobile}</p>
              </div>
              <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                <a href={`tel:${order.assignedDeliveryBoy.mobile}`} className="bg-blue-500 rounded-xl cursor-pointer hover:bg-blue-600 py-2 px-5 text-white">Call Now</a>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${status == 'delivered' ? 'bg-green-100 text-green-700'
            : status == 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
            }`}>
            {status}
          </span>
          {status !== 'delivered' && (
            <select
              value={status}
              onChange={(e) => {
                const chosen = e.target.value;
                updateStatus(order._id?.toString()!, chosen);
              }}
              className='border border-gray-300 rounded-1g px-3 py-1 text-sm shadow hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none rounded-full cursor-pointer'
            >
              {statusOptions.map(st => (
                <option key={st} value={st}>
                  {st.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 pt-3 mt-2">
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
      <div className="border-t pt-3 mt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
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
    </motion.div >
  )
}

export default AdminOrderCard