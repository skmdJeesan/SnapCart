'use client'
import { ArrowLeft, Eye, EyeClosed, Leaf, Loader, Lock, LogIn, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import {motion} from 'framer-motion'
import Image from "next/image"
import googleImg from '@/src/assets/google.png'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn("credentials", {email, password})
      setLoading(false)
      router.push('/')
      setEmail('')
      setPassword('')
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 relative font-serif'>
      <motion.h1 
        initial = {{opacity: 0, y: -10}}
        animate= {{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className="text-4xl font-extrabold text-green-700 mb-1">
        Welcome Back
      </motion.h1>
      <p className='flex items-center gap-1 text-gray-600 mb-6'>Start shopping today <Leaf className='w-5 h-5 text-green-500'/></p>
      <motion.form
      onSubmit={handleLogin}
        initial = {{opacity: 0,}}
        animate= {{opacity: 1,}}
        transition={{duration: 0.6}}
        className='flex flex-col gap-4 w-full max-w-sm'
      >
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
            const isFormValid = email !== '' && password !== ''
            return (
              <button disabled={!isFormValid || loading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${isFormValid ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                {loading ? <Loader className='w-5 h-5 animate-spin'/> : "Log in"}
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
        Does not have an Account ? 
        <LogIn className='w-4 h-4'/> 
        <span className='text-green-600 cursor-pointer' onClick={() => router.push('/register')}>Sign up</span>
      </p>
    </div>
  )
}

export default Login