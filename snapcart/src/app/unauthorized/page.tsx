import React from 'react'

const Unauthorized = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-gray-300 min-h-screen'>
      <h1 className='text-4xl text-red-500 mb-1'>Access denied 🚫</h1>
      <p className='text-base text-gray-700 -ml-4'>You are not authorized to access this page.</p>
    </div>
  )
}

export default Unauthorized