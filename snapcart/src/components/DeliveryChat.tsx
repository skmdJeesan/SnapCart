import { LoaderPinwheelIcon, SendIcon, SparkleIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { getSocket } from "../lib/socket"
import { IMessage } from "../models/message.model"
import axios from "axios"
import { motion, AnimatePresence } from 'framer-motion'

type props = {
  orderId: string,
  deliveryBoyId: string
}

function DeliveryChat({ orderId, deliveryBoyId }: props) {
  const [msgs, setMsgs] = useState<IMessage[]>()
  const [newMessage, setNewMessage] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
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

  const sendMsg = () => {
    const socket = getSocket()
    const msg = {
      roomId: orderId,
      text: newMessage,
      senderId: deliveryBoyId,
      time: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
    }
    socket.emit('send-message', msg)
    setNewMessage('')
  }

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current?.scrollHeight,
      behavior: 'smooth'
    })
  }, [msgs])

  const getSuggestions = async () => {
    setLoading(true)
    try {
      const lastMsg = msgs?.filter(m => m.senderId.toString() !== deliveryBoyId)?.at(-1)
      const res = await axios.post('/api/chat/suggestions', { msg: lastMsg?.text, role: 'delivery_boy' })
      setSuggestions(res.data)
      setLoading(false)
      // console.log(res.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className='bg-white rounded-3xl shadow-lg border p-4 h-107.5 flex flex-col'>
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-700 text-sm">Quick reply</span>
        <button
          disabled={loading}
          onClick={getSuggestions}
          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer active:scale-95">
          {loading ? <LoaderPinwheelIcon size={16} className='animate-spin' /> : <span className='flex items-center gap-1'><SparkleIcon size={14} /> AI suggest</span>}
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
              className={`flex ${msg.senderId.toString() == deliveryBoyId ? "justify-end" : "justify-start"}`}
            >
              <div className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                ${msg.senderId.toString() === deliveryBoyId
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
  )
}

export default DeliveryChat