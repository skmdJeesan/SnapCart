'use client'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Package } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearCart } from '@/src/redux/cartSlice'

const OrderSuccess = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    // whenever user lands on this success page (either COD or after online payment)
    dispatch(clearCart())
  }, [dispatch])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen w-full bg-linear-to-b from-green-100 to-white text-center px-4'>
      <motion.div
        initial={{ scale: 0.4, rotate: -180, opacity: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 10 }}
        className='relative'
      >
        <CheckCircle className='w-24 h-24 text-green-600 md:w-28 md:h-28' />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.5, 0, 0.5], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className='absolute inset-0'
        >
          <div className="w-full h-full rounded-full bg-green-900 blur-xl" />
        </motion.div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className='text-3xl md:text-4xl font-bold text-green-700 mt-6'
      >
        Order Placed Successfully
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className='text-gray-600 mt-3 text-sm md:text-base max-w-sm'
      >
        Thank you for shopping with us! Your order has been placed and is being processed. You can track its progress in your&nbsp;
        <span className="font-semibold text-green-700">My Orders</span> section.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{ duration: 2, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
        className='mt-6 mb-6'
      >
        <Package className='w-16 h-16 text-green-600 mt-8 md:w-20 md:h-20' />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className=''
      >
        <Link href={"/user/my-orders"}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-8 py-3 rounded-full shadow-1g transition-all'
          >
            Go to My Orders <ArrowRight />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}

export default OrderSuccess