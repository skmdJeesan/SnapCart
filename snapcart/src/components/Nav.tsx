'use client'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Boxes, ClipboardCheck, LogOut, LogOutIcon, LucideMenu, Package, PlusCircle, Search, SearchIcon, ShoppingCartIcon, User, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { signOut } from 'next-auth/react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useRouter } from 'next/navigation';

interface IUser {
  _id?: string
  name: string
  email: string
  password: string
  mobile?: string
  role: "user" | "admin" | "deliveryBoy"
  image: string
}

function Nav({user}: {user: IUser}) {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [searchBarOpen, setSearchBarOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = search.trim()
    if(!query) return router.push('/')
    router.push(`/?q=${encodeURIComponent(query)}`)
    setSearch('')
    setSearchBarOpen(false)
  }

  const {cartData} = useSelector((state: RootState) => state.cart)

  useEffect(() => {
    const clickOutSIde = (e: MouseEvent) => {
      if(profileDropdownRef.current && !profileDropdownRef.current?.contains(e.target as Node)) 
        setOpen(false) 
    }
    document.addEventListener('mousedown', clickOutSIde)
    return () => document.removeEventListener('mousedown', clickOutSIde)
  }, [])

  const sidebar = menu ? createPortal(
    <AnimatePresence>
      <motion.div
        initial={{x: -100, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        exit={{x: 100, opacity: 1}}
        transition={{type: 'spring', stiffness: 90, damping: 14}}
        className='font-sans fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-999 bg-linear-to-br from-green-800/40 via-green-700/50 to-green-900/40 backdrop-blur-xl border-r border-green-400/20 shadow-[0_0_50px_-10px__rgba(0,255,100,0.3)] flex flex-col p-6 text-white'
      >
        <div className='flex justify-between'>
          <h1 className='font-bold text-xl'>Admin Panel</h1>
          <X className='w-5 h-5' onClick={() => setMenu(!menu)}/>
        </div>
        <div className="flex items-start gap-3 px-3 py-2 border-b border-white/40 mb-4 mt-2">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden relative">
            {user.image ? <Image src={user.image} alt='user-image' fill className='object-cover rounded-full'/> : <User className='w-5 h-5'/>}
          </div>
          <div>
            <div className="text-sm font-semibold">{user.name}</div>
            <div className="text-xs capitalize">{user.role}</div>
          </div>
        </div>
        <div className='flex flex-col items-center gap-4 font-sans'>
          <Link href={'/admin/add-grocery'} className='w-full flex items-center justify-center gap-2 bg-white text-green-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'>
            <PlusCircle className='w-5 h-5'/>
            Add Grocery
          </Link>
          <Link href={'/admin/view-grocery'} className='w-full flex items-center justify-center gap-2 bg-white text-green-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'>
            <Boxes className='w-5 h-5'/>
            View Grocery
          </Link>
          <Link href={'/admin/manage-orders'} className='w-full flex items-center justify-center gap-2 bg-white text-green-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'>
            <ClipboardCheck className='w-5 h-5'/>
            Manage Orders
          </Link>
        </div>
        <div className='my-5 border-t border-white/40'></div>
        <div 
          onClick={async () => await signOut({callbackUrl: '/'})}
          className="flex gap-3 text-red-300 items-center font-semibold mt-auto p-3 hover:text-red-500 transition-all">
          <LogOutIcon className='w-4 h-4'/> 
          Log Out
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null

  return (
    <div className='navbar w-[90%] fixed top-4 left-1/2 -translate-x-1/2 rounded-4xl shadow-lg shadow-black/30 bg-linear-to-r from-green-400 to-green-500 flex items-center justify-between px-4 md:px-8 h-18 z-999 py-1'>
      <Link href={'/'} className="font-sans font-bold text-2xl md:text-3xl tracking-wide hover:scale-105 transition-transform">Snap<span className='text-amber-400'>cart.</span></Link>

      {user.role == 'user' &&
        <form 
          onSubmit={handleSearch}
          className='hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md'>
          <Search className='text-gray-500 mr-2 w-5 h-5'/>
          <input 
            type='search' 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full text-gray-700 placeholder-gray-400 outline-none placeholder:font-sans'
            placeholder='search groceries..'
          />
        </form>
      }

      <div className="flex items-center gap-3 md:gap-6 relative">

        {user.role === 'user' && <div 
          onClick={() => setSearchBarOpen(!searchBarOpen)}
          className='md:hidden relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition'>
          <SearchIcon className='w-5 h-5 text-green-600'/>
        </div>}

        {user.role == 'user' && <Link href={'/user/cart'} className='relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition'>
          <ShoppingCartIcon className='w-5 h-5 text-green-600'/>
          <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow'>{cartData?.length}</span>
        </Link>}

        {user.role == 'admin' && <><div className='hidden md:flex items-center gap-4 font-sans'>
            <Link href={'/admin/add-grocery'} className='flex items-center gap-2 bg-white text-green-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'>
              <PlusCircle className='w-5 h-5'/>
              Add Grocery
            </Link>
            <Link href={'/admin/view-grocery'} className='flex items-center gap-2 bg-white text-green-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'>
              <Boxes className='w-5 h-5'/>
              View Grocery
            </Link>
            <Link href={'/admin/manage-orders'} className='flex items-center gap-2 bg-white text-green-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all'>
              <ClipboardCheck className='w-5 h-5'/>
              Manage Orders
            </Link>
          </div>
          <div onClick={() => setMenu(!menu)}
            className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
            <LucideMenu className='w-5 h-5 text-green-600'/>
          </div>
        </>}

        <div className="relative" ref={profileDropdownRef}>
          <div onClick={() => setOpen(!open)} 
            className='bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer'>
            {user.image ? <Image src={user.image} alt='user-image' height={40} width={40} className='object-cover rounded-full'/> 
            : <User className='w-5 h-5'/>}
          </div>
          <AnimatePresence>
            {open && 
              <motion.div
              initial={{opacity: 0, scale: 0.95, y: -10}}
              animate={{opacity: 1, scale: 1, y: 0}}
              transition={{duration: 0.4}}
              exit={{opacity: 0, scale: 0.95, y: -10}}
              className='font-sans absolute -right-1 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999'
              >
                <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden relative">
                    {user.image ? <Image src={user.image} alt='user-image' fill className='object-cover rounded-full'/> : <User className='w-5 h-5'/>}
                  </div>
                  <div>
                    <div className="text-sm text-gray-800 font-semibold">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>
                {user.role == 'user' && <Link 
                  onClick={() => setOpen(false)}
                  href={'/user/my-orders'} className="flex items-center gap-2 p-3 text-left hover:bg-green-100 text-gray-700 rounded-lg text-sm">
                  <Package className='h-5 w-5 text-green-600'/> My Orders
                </Link>}
                <button 
                  onClick={() => {
                    setOpen(false)
                    signOut({callbackUrl: '/login'})
                  }}
                  className="cursor-pointer flex items-center gap-2 p-3 text-left hover:bg-red-100 text-gray-700 w-full rounded-lg text-sm" >
                  <LogOut className='h-5 w-5 text-red-600'/> Log Out
                </button>
              </motion.div>}
          </AnimatePresence>
          <AnimatePresence>
            {searchBarOpen && 
              <motion.div
                initial={{opacity: 0, scale: 0.95, y: -10}}
                animate={{opacity: 1, scale: 1, y: 0}}
                transition={{duration: 0.4}}
                exit={{opacity: 0, scale: 0.95, y: -10}}
                className='font-sans fixed top-22 left-1/2 -translate-x-1/2 w-[90%] rounded-full shadow-lg bg-white z-40 flex items-center'
              >
                <form 
                  onSubmit={handleSearch}
                  className='flex md:hidden items-center bg-white rounded-full px-4 py-2 max-w-lg shadow-md w-full'>
                  <Search className='text-gray-500 mr-2 w-5 h-5'/>
                  <input 
                    type='text' 
                    className='w-full text-gray-700 placeholder-gray-400 outline-none placeholder:font-sans'
                    placeholder='search groceries..'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button onClick={() => setSearchBarOpen(false)}>
                    <X className='w-5 h-5 text-gray-500' />
                  </button>
                </form>
                
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>
      {sidebar}
    </div>
  )
}

export default Nav