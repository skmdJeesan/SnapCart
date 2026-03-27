'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Package, XCircle } from 'lucide-react'
import Link from 'next/link'

const OrderCancel = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen w-full bg-linear-to-b from-green-100 to-white text-center px-4'>
      <motion.div
        initial={{ scale: 0.4, rotate: -180, opacity: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 10 }}
        className='relative'
      >
        <XCircle className='w-24 h-24 text-red-600 md:w-28 md:h-28' />
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
        className='text-3xl md:text-4xl font-bold text-red-700 mt-6'
      >
        Order Failed!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className='text-gray-600 mt-3 text-sm md:text-base max-w-sm mb-6'
      >
        Sorry for the inconvenience. Your order could not be processed at this time. Please try again later or contact our support team for assistance.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className=''
      >
        <Link href={"/"}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-base font-semibold px-8 py-3 rounded-full shadow-1g transition-all'
          >
            Go to Home <ArrowRight />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}

export default OrderCancel