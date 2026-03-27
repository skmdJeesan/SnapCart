'use client'
import { ArrowRight, Bike, User, UserCog } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: {staggerChildren: 0.2,}}
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, } }
};

function EditRoleAndMobile() {
  const [roles, setRoles] = useState([
    {id: 'admin', label: 'Admin', icon: UserCog},
    {id: 'user', label: 'User', icon: User},
    {id: 'deliveryBoy', label: 'Delivery Boy', icon: Bike},
  ])
  const [selectedRole, setSelectedRole] = useState('')
  const [mobile, setMobile] = useState('')
  const router = useRouter()
  const {update} = useSession()

  const handleEdit = async () => {
    try {
      const result = await axios.post('/api/user/edit-role-mobile', {role: selectedRole, mobile})
      console.log(result.data)
      await update({role: selectedRole})
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const res = await axios.get('/api/check-for-admin-presence')
        if(res.data.adminExists) 
          setRoles(prev => prev.filter(r => r.id !== 'admin'))
      } catch (error) { console.log(error) }
    }
    checkForAdmin()
  }, [])

  return (
    <div className='flex flex-col items-center w-full min-h-screen p-6'>
      <motion.h1
        initial = {{opacity: 0, y: -20}}
        animate= {{opacity: 1, y: 0}}
        transition={{duration: 0.6}} 
        className='text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8'>
        Select Your Role
      </motion.h1>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row justify-center items-center mt-10 gap-6">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = (selectedRole == role.id)
          return (
            <motion.div
              key={role.id}
              variants={itemVariants}
              whileTap={{scale: 0.9}}
              onClick={() => setSelectedRole(role.id)}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 cursor-pointer
                ${isSelected ? 'border-green-600 bg-green-100 shadow-lg' : 'border-gray-300 bg-white hover:border-green-400'}
              `}
            >
              <Icon />
              <span>{role.label}</span>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className='flex flex-col items-center mt-10'
      >
        <label htmlFor="mobile" className='text-gray-700 font-medium mb-2'>Enter your Mobile number</label>
        <input 
          type='tel' 
          id='mobile' 
          className='w-6 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800' 
          placeholder='eg. 0000000000'
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </motion.div>

      <motion.button
        onClick={handleEdit}
        variants={itemVariants}
        initial='hidden'
        animate='show'
        disabled={!selectedRole || mobile.length !== 10}
        className={`inline-flex items-center gap-2 mt-8 font-semibold px-8 py-3 rounded-xl shadow-md
          ${ selectedRole && mobile.length == 10 
            ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        Next <ArrowRight className='h-5 w-5'/>
      </motion.button>
    </div>
  )
}

export default EditRoleAndMobile