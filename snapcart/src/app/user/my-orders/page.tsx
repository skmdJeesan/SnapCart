'use client'
import axios from "axios"
import { ArrowLeft, Loader, Loader2, PackageSearch } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import UserOrderCard from "@/src/components/UserOrderCard"
import { IUser } from "@/src/models/user.model"
import { getSocket } from "@/src/lib/socket"
import { useSelector } from "react-redux"
import { RootState } from "@/src/redux/store"

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

const MyOrders = () => {
  const router = useRouter()
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const userData = useSelector((state: RootState) => state.user.userData)

  useEffect(() => {
    if (userData?._id) {
      const socket = getSocket()
      socket.emit('identity', userData._id)
    }
  }, [userData?._id])
  
  useEffect(() => {
    const getMyOrders = async () => {
      try {
        // ensure we hit the root API path, not relative to the current route
        const res = await axios.get('/api/user/my-orders');
        setOrders(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getMyOrders();
  }, []); // run once on mount, not on every orders change

  useEffect((): any => {
    const socket = getSocket()
    socket.on('order-assigned', ({orderId, assignedDeliveryBoy}) => {
      setOrders(prev => (
        prev?.map(o => o._id == orderId ? {...o, assignedDeliveryBoy}: o)
      ))
    })

    return () => socket.off('order-assigned')
  }, [])

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-2">
        <Loader className="h-10 w-10 animate-spin" />
        <p className="text-lg">Loading..</p>
      </div>
    )
  }
  return (
    <div className='bg-linear-to-b from-white to-gray-100 min-h-screen w-full'>
      <div className='max-w-3xl mx-auto px-4 pt-6 pb-6 relative'>
        <div className='sticky top-0 w-full border-none z-50'>
          <div className='w-full mx-auto flex items-center gap-4 px-4 py-3 '>
            <button className='p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition cursor-pointer' onClick={() => router.push("/")}>
              <ArrowLeft size={24} className="text-green-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          </div>
        </div>
        <div className="h-3" />
        {orders.length > 0 ? (
          <div className="mt-4 w-full h-full">
            {orders.map((order, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="w-full h-full"
              >
                <UserOrderCard order={order} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-2 pt-8">
            <PackageSearch size={70} className="text-green-600 mb-4 animate-pulse"/>
            <p className="text-base text-gray-500">You have no orders yet.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 text-white  hover:bg-green-700 active:scale-95 transition rounded-full mt-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              Order Now
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders