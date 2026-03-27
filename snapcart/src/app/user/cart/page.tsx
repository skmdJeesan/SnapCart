'use client'
import { ArrowLeft, Minus, Plus, ShoppingBasket, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/src/redux/store'
import Image from 'next/image'
import { decreaseQty, increaseQty, removeFromCart } from '@/src/redux/cartSlice'
import { useRouter } from 'next/navigation'

const CartPage = () => {
  const { cartData, subTotal, deliveryCharge, total } = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  return (
    <div className='w-[95%] sm:w-[90%] mx-auto mt-8 mb-24 relative'>
      <Link href={'/'} className='absolute left-0 -top-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-all active::scale-95'>
        <ArrowLeft size={20} />
        <span className='hidden sm:inline'>Back to home</span>
      </Link>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-10 text-center font-serif'
      >
        🛒 Your Shopping Cart
      </motion.h2>
      {cartData?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center text-gray-500 mt-10 py-20 bg-white rounded-2xl shadow-md'
        >
          <ShoppingBasket className='w-16 h-16 mx-auto mb-4' />
          <p>Your cart is empty. Start shopping now!</p>
          <Link href={'/'} className='mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition'>
            Shop Now
          </Link>
        </motion.div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className="lg:col-span-2 space-y-5">
            <AnimatePresence>
              {cartData?.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{opacity: 0, y: -20}}
                  className='bg-white rounded-2xl shadow-md p-4 flex flex-col items-center sm:flex-row hover:shadow-xl transition-all duration-300 border border-gray-100 relative'
                >
                  <div className='relative w-28 h-28 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-gray-50'>
                    <Image src={item.image} alt='image' fill className='object-contain p-3 transition-transform duration-300 hover:scale-105' />
                  </div>
                  <div className='mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left'>
                    <h3 className='text-base sm:text-lg font-semibold text-gray-800 line-clamp-1'>{item.name}</h3>
                    <p className='text-xs sm:text-sm font-medium text-gray-700'>{item.unit}</p>
                    <p className='text-green-700 font-bold mt-1 text-sm sm:text-base'>Total: ₹{Number(item.price) * item.qty}</p>
                  </div>
                  <div className='flex items-center justify-center sm:justify-end gap-2 mt-3 sm:mt-0 bg-gray-50 px-3 py-2 rounded-full'>
                    <button
                      onClick={() => dispatch(decreaseQty(item._id))}
                      className='w-6 h-6 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all cursor-pointer'>
                      <Minus size={16} className='text-green-700' />
                    </button>
                    <span className='text-gray-800 font-semibold text-sm w-12 h-6 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 transition-all'>{item.qty}</span>
                    <button
                      onClick={() => dispatch(increaseQty(item._id))}
                      className='w-6 h-6 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all cursor-pointer'>
                      <Plus size={16} className='text-green-700' />
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className='absolute right-2 top-2 text-red-500 hover:text-red-600 bg-red-100 hover:bg-red-200 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer'>
                    <TrashIcon size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3,}}
            className='bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24 border border-gray-100 flex flex-col'
          >
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 font-serif">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-700 sm:text-base">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className='text-green-700 font-semibold'>₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className='text-green-700 font-semibold'>₹{deliveryCharge}</span>
              </div>
              <hr className='my-3'/>
              <div className="flex justify-between font-bold text-lg">
                <span>Final Total</span>
                <span className='text-green-700 font-semibold'>₹{total}</span>
              </div>
            </div>
            <motion.button
              onClick={() => router.push('/user/checkout')}
              whileTap={{ scale: 0.95 }}
              className='mt-6 bg-green-600 hover:bg-green-700 text-white rounded-full py-3 text-sm font-medium transition-all cursor-pointer'
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      )
      }
    </div >
  )
}

export default CartPage