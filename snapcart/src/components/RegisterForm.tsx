import { ArrowLeft, Eye, EyeClosed, Leaf, Loader, Lock, LogIn, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import {motion} from 'framer-motion'
import Image from "next/image"
import googleImg from '@/src/assets/google.png'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

type propType = { setStep: (step: number) => void }

function RegisterForm({setStep}: propType) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post('/api/auth/register', {name, email, password})
      //console.log(result.data)
      setLoading(false)
      router.push('/login')
      setName('')
      setEmail('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 relative font-serif'>
      <div onClick={() => setStep(1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-500 hover:text-green-700 cursor-pointer font-semibold">
        <ArrowLeft className='w-4 h-4 '/>
        <span className=''>Back</span>
      </div>
      <motion.h1 
        initial = {{opacity: 0, y: -10}}
        animate= {{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className="text-4xl font-extrabold text-green-700 mb-1">
        Create An Account
      </motion.h1>
      <p className='flex items-center gap-1 text-gray-600 mb-6'>Join Snapcart today <Leaf className='w-5 h-5 text-green-500'/></p>
      <motion.form
        onSubmit={handleRegister}
        initial = {{opacity: 0,}}
        animate= {{opacity: 1,}}
        transition={{duration: 0.6}}
        className='flex flex-col gap-4 w-full max-w-sm'
      >
        <div className="relative">
          <User className='absolute left-3 top-3.5 w-5 h-5 text-gray-400'/>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)} 
            type="text" placeholder='Your Name' 
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-200 focus:outline-none" 
          />
        </div>
        <div className="relative">
          <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400'/>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            type="email" placeholder='Your Email' 
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-200 focus:outline-none" 
          />
        </div>
        <div className="relative">
          <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400'/>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            type={showPassword ? 'text' : 'password'} placeholder='Your Password' 
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-200 focus:outline-none" 
          />
          {showPassword 
            ? <EyeClosed 
                onClick={() => setShowPassword(false)}
                className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer'
              /> 
            : <Eye 
                onClick={() => setShowPassword(true)}
                className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer'
              />
          }
        </div>
        {
          (() => {
            const isFormValid = name !== '' && email !== '' && password !== ''
            return (
              <button disabled={!isFormValid || loading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${isFormValid ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                {loading ? <Loader className='w-5 h-5 animate-spin'/> : "Register"}
              </button>
            )

          })()
        }
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
          <span className="h-px bg-gray-200 flex-1"></span>
          OR
          <span className="h-px bg-gray-200 flex-1"></span>
        </div>
        <button 
          type="button"
          onClick={() => signIn('google', {callbackUrl: '/'})}
          className='w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer'>
          <Image src={googleImg} alt='google' width={20} height={20}/>
          Continue with Google
        </button>
      </motion.form>
      <p className='flex items-center gap-1 mt-6 text-sm text-gray-600'>
        already have an Account ? 
        <LogIn className='w-4 h-4'/> 
        <span className='text-green-600 cursor-pointer' onClick={() => router.push('/login')}>Sign in</span>
      </p>
    </div>
  )
}

export default RegisterForm