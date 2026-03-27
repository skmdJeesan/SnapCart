'use client'
import { Leaf, ShoppingBasket, Smartphone, Truck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { getSocket } from '../lib/socket'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'


const slides = [
  {
    id: 1,
    icon: <Leaf className="w-10 h-10 sm:w-18 sm:h-18 text-green-400 drop-shadow-lg" />,
    title: "Fresh Organic Groceries 🥦",
    subtitle: "Farm-fresh fruits, vegetables, and daily essentials delivered to you.",
    btnText: "Shop Now",
    bg: 'https://plus.unsplash.com/premium_photo-1663012860167-220d9d9c8aca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    icon: <Truck className="w-10 h-10 sm:w-18 sm:h-18 text-yellow-400 drop-shadow-lg" />,
    title: "Fast & Reliable Delivery 🚚",
    subtitle: "We ensure your groceries reach your doorstep in no time.",
    btnText: "Order Now",
    bg: 'https://images.unsplash.com/photo-1616915939238-2a7a363d45c4?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    icon: <Smartphone className="w-10 h-10 sm:w-18 sm:h-18 text-blue-400 drop-shadow-lg" />,
    title: "Shop Anytime, Anywhere 📱",
    subtitle: 'Easy and seamless online grocery shopping experience.',
    btnText: 'Get Started',
    bg: 'https://plus.unsplash.com/premium_photo-1658506615404-9a26357cb2c6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
]

const UserHeropage = () => {
  const { userData } = useSelector((state: RootState) => state.user)
  useEffect(() => {
    if (userData) {
      let socket = getSocket()
      socket?.emit("identity", userData?._id)
    }
  }, [userData])

  const [currentSlide, setCurrentSlide] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className='font-sans relative mx-auto w-[90%] mt-28 h-[80vh] rounded-3xl shadow-2xl overflow-hidden bg-gray-400/20'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentSlide}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1, scale: 1.05 }}
          exit={{ x: -200, opacity: 0 }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 6, ease: "easeOut" }, // slow Ken Burns effect
          }}
          className='absolute inset-0'
        >
          <Image
            src={slides[currentSlide].bg}
            alt='slides' fill priority
            className='object-cover object-bottom rounded-3xl'
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/70" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className='flex flex-col items-center justify-center gap-6 max-w-3xl'
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg">{slides[currentSlide].icon}</div>
          <div className="">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg whitespace-nowrap mb-1">{slides[currentSlide].title}</h1>
            <p className="text-gray-200 max-w-2xl">{slides[currentSlide].subtitle}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='cursor-pointer flex items-center gap-2 mt-4 bg-white text-green-600 hover:bg-green-100 px-8 py-3 rounded-full shadow-lg font-semibold transition-transform'
          >
            <ShoppingBasket className='w-5 h-5' />
            {slides[currentSlide].btnText}
          </motion.button>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, idx) => {
          return <button key={idx} className={`w-3 h-3 rounded-full transition ${(idx == currentSlide) ? 'bg-white w-6' : 'bg-white/50'}`} />
        })}
      </div>

    </div>
  )
}

export default UserHeropage