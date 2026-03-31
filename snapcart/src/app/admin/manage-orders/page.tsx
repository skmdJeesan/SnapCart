'use client'
import AdminOrderCard from '@/src/components/AdminOrderCard'
import { getSocket } from '@/src/lib/socket'
import { IUser } from '@/src/models/user.model'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/src/redux/store'

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

const ManageOrders = () => {
  const router = useRouter()
  const [orders, setOrders] = useState<IOrder[]>([])
  const userData = useSelector((state: RootState) => state.user.userData)

  useEffect(() => {
    if (userData?._id) {
      const socket = getSocket()
      socket.emit('identity', userData._id)
    }
  }, [userData?._id])
  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get('/api/admin/get-orders')
        console.log(res.data)
        setOrders(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getOrders()
  }, [])

  useEffect(() => {
    const socket = getSocket()
    socket.on('new-order', (newOrder) => {
      // console.log(newOrder)
      setOrders(prev => [newOrder, ...prev])
    })
    socket.on('order-assigned', ({orderId, assignedDeliverBoy}) => {
      setOrders(prev => (
        prev?.map(o => o._id == orderId ? {...o, assignedDeliverBoy}: o)
      ))
    })
    return () => {
      socket.off('new-order')
      socket.off('order-assigned')
    }
  }, [])

  return (
    <div className='w-full min-h-screen bg-gray-200'>
      <div className="space-y-8 max-w-3xl mx-auto px-4 pb-66 pt-6">
        <div className='sticky top-0 w-full border-none z-50'>
          <div className='w-full mx-auto flex items-center gap-4 px-4 py-3 '>
            <button className='p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition cursor-pointer' onClick={() => router.push("/")}>
              <ArrowLeft size={24} className="text-green-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Manage Orders</h1>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="mt-6">
            {orders.map((order, i) => (
              <AdminOrderCard key={i} order={order} />
            ))}
          </div>
        ) : (
          <div className="">No Orders found</div>
        )}
      </div>
    </div>
  )
}

export default ManageOrders