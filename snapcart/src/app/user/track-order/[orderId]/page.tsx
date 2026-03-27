'use client'
import LiveMap from '@/src/components/LiveMap'
import { getSocket } from '@/src/lib/socket'
import { IMessage } from '@/src/models/message.model'
import { IOrder } from '@/src/models/order.model'
import { RootState } from '@/src/redux/store'
import axios from "axios"
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, LoaderPinwheelIcon, SendIcon, SparkleIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

interface ILocation {
  latitude: number,
  longitude: number
}

const TrackOrder = () => {
  const { orderId } = useParams();
  const { userData } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const [order, setOrder] = useState<IOrder>()
  const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 })
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({ latitude: 0, longitude: 0 })

  useEffect(() => {
    const getOrder = async () => {
      if (!orderId) return; // Prevent running if the ID hasn't mounted yet
      try {
        const res = await axios.get(`/api/user/get-order/${orderId}`)
        //console.log("Order Data:", res.data)
        setOrder(res.data)
        setUserLocation({
          latitude: res.data.address.latitude,
          longitude: res.data.address.longitude,
        })
        setDeliveryBoyLocation({
          latitude: res.data.assignedDeliveryBoy.location.coordinates[1],
          longitude: res.data.assignedDeliveryBoy.location.coordinates[0],
        })
      } catch (error) {
        console.log("Fetch Error:", error)
      }
    }
    getOrder()
  }, [userData?._id])

  useEffect((): any => {
    const socket = getSocket()
    socket.on('update-deliveryBoy-location', ({ userId, location }) => {
      if (userId.toString() === order?.assignedDeliveryBoy?._id?.toString()) {
        setDeliveryBoyLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0]
        })
      }
    })
    return () => socket.off('update-deliveryBoy-location')
  }, [order])

  const chatRef = useRef<HTMLDivElement>(null)
  const [msgs, setMsgs] = useState<IMessage[]>()
  const [newMessage, setNewMessage] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const getSuggestions = async () => {
    setLoading(true)
    try {
      const lastMsg = msgs?.filter(m => m.senderId.toString() !== userData?._id?.toString())?.at(-1)
      const res = await axios.post('/api/chat/suggestions', { msg: lastMsg?.text, role: 'user' })
      setSuggestions(res.data)
      setLoading(false)
      // console.log(res.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect((): any => {
    const socket = getSocket()
    socket.emit('join-room', orderId)
    socket.on('send-message', (msg) => {
      if (msg.roomId === orderId)
        setMsgs((prev) => [...prev!, msg])
    })
    return () => { socket.off('send-message') }
  }, [])

  useEffect(() => {
    const getAllMsgs = async () => {
      try {
        const res = await axios.post('/api/chat/get-messages', { roomId: orderId })
        setMsgs(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllMsgs()
  }, [])

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current?.scrollHeight,
      behavior: 'smooth'
    })
  }, [msgs])

  const sendMsg = () => {
    const socket = getSocket()
    const msg = {
      roomId: orderId,
      text: newMessage,
      senderId: userData?._id,
      time: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
    }
    socket.emit('send-message', msg)
    setNewMessage('')
  }

  return (
    <div className='w-full min-h-screen bg-linear-to-b from-green-50 to-white'>
      <div className='max-w-4xl mx-auto pb-24'>
        <div className='sticky top-0 bg-white/80 backdrop-blur-x1 p-3 border-b shadow flex gap-3 items-center z-999'>
          <button className='p-2 bg-green-100 rounded-full cursor-pointer' onClick={() => router.back()}>
            <ArrowLeft className="text-green-700" size={20} />
          </button>
          <div>
            <h2 className='text-xl font-bold'>Track Order</h2>
            <p className='text-sm text-gray-600'>
              Order #{order?._id?.toString().slice(-6)}
              <span className='text-black font-semibold bg-blue-300/60 p-1 rounded-lg ml-2'>{order?.status}</span>
            </p>
          </div>
        </div>
        <div className="px-4 mt-6 space-y-4 flex flex-col items-center justify-center">
          <div className='rounded-3xl overflow-hidden border shadow w-[85%]'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>
          <div className='bg-white rounded-3xl shadow-lg border p-4 h-107.5 w-[85%] flex flex-col'>
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700 text-sm">Quick reply</span>
              <button 
                disabled={loading}
                onClick={getSuggestions}
                className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer active:scale-95">
                {loading ? <LoaderPinwheelIcon size={16} className='animate-spin'/> : <span className='flex items-center gap-1'><SparkleIcon size={14} /> AI suggest</span>}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setNewMessage(s)}
                  className="px-3 py-1 text-xs cursor-pointer active:scale-92 hover:scale-105 bg-green-50 border border-green-200 text-green-700 rounded-full">
                  {s}
                </button>
              ))}
            </div>
            <div className='flex-1 overflow-y-auto p-2 space-y-3' ref={chatRef}>
              <AnimatePresence>
                {msgs?.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.senderId.toString() == userData?._id?.toString() ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                ${msg.senderId.toString() === userData?._id?.toString()
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                      <p>{msg.text}</p>
                      <p className="opacity-70 text-xs text-right">{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className='flex gap-2 mt-3 pt-3'>
              <input type="text" placeholder='Type a Message...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus: ring-green-500'
              />
              <button
                onClick={sendMsg}
                className='bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white cursor-pointer'>
                <SendIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrder