import { ArrowRight, Bike, ShoppingBasket } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

type propType = { setStep: (step: number) => void }

function Welcome({setStep}: propType) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6 font-serif'>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex items-center gap-3">
        <ShoppingBasket className='w-12 h-12 text-green-600' />
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">Snapcart</h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-4 text-lg md:text-xl text-gray-700 max-w-lg">
        Your one-stop destination for fresh groceries, organic produce, and daily essentials delivered right to your doorstep.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="mt-8 flex items-center justify-center gap-8">
        <ShoppingBasket className='w-24 h-24 md:w-32 md:h-32 text-green-600 drop-shadow-md' />
        <Bike className='w-24 h-24 md:w-32 md:h-32 text-orange-600 drop-shadow-md' />
      </motion.div>
      
      <motion.button
        onClick={() => setStep(2)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-10 px-6 py-3 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 shadow-md transition-all duration-100 cursor-pointer">
        Start Shopping <ArrowRight className='inline-block w-5 h-5 ml-2' />
      </motion.button>
    </div>
  )
}

export default Welcome