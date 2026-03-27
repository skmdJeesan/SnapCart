'use client'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import React from 'react'
import { addToCart, decreaseQty, increaseQty } from '../redux/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'

interface IGrocery {
  _id: string,
  name: string,
  category: string,
  price: string,
  unit: string,
  image: string,
  createdAt?: Date,
  updatedAt?: Date
}

const GroceryCard = ({ item }: { item: IGrocery }) => {
  const dispatch = useDispatch<AppDispatch>()
  const {cartData} = useSelector((state: RootState) => state.cart)
  const cartItem = cartData?.find(cartItem => cartItem._id === item._id)
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, }}
      viewport={{ once: true, amount: 0.5 }}
      className='bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-100 flex flex-col'
    >
      <div className='relative w-full aspect-4/3 bg-gray-50 overflow-hidden group'>
        <Image
          src={item.image} alt={item.name} fill
          sizes='(max-width: 768px) 100vw, 25vw'
          className='object-contain p-4 transition-transform duration-500 group-hover:scale-105 rounded-2xl'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />
      </div>
      <div className='p-4 flex flex-col flex-1'>
        <p className='text-xs text-gray-500 font-medium mb-1'>{item.category}</p>
        <h3>{item.name}</h3>
        <div className='flex items-center justify-between mt-2'>
          <span className='text-xs font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded-full'>{item.unit}
          </span>
          <span className='text-green-700 font-bold text-lg'>₹{item.price}</span>
        </div>
        {!cartItem ? <motion.button
          onClick={() => dispatch(addToCart({...item, qty: 1}))} 
          whileTap={{ scale: 0.96 }}
          className='cursor-pointer mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full py-2 text-sm font-medium transition-all'
        >
          <ShoppingCart /> Add to Cart
        </motion.button> : 
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{duration: 0.4}}
          className='mt-4 flex items-center justify-center border border-green-200 bg-green-50 rounded-full py-2 px-4 gap-6 transition-all'
        > 
          <button 
            onClick={() => dispatch(decreaseQty(item._id))}
            className='w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all cursor-pointer'>
            <Minus size={16} className='text-green-700'/>
          </button>
          <span className='text-gray-800 font-semibold text-sm w-12 h-7 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 transition-all'>{cartItem.qty}</span>
          <button 
            onClick={() => dispatch(increaseQty(item._id))}
            className='w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-all cursor-pointer'>
            <Plus size={16} className='text-green-700'/>
          </button>
        </motion.button>}
      </div>
     
    </motion.div >
  )
}

export default GroceryCard