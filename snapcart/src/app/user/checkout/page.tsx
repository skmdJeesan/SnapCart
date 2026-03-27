'use client'
import { ArrowLeft, Building, CreditCard, Home, Loader, LocateFixed, MapPin, Navigation, Phone, PinIcon, Search, Truck, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/src/redux/store'
import { clearCart } from '@/src/redux/cartSlice' 
import axios from 'axios'
import dynamic from 'next/dynamic'
const CheckoutMap = dynamic(() => import('@/src//components/CheckoutMap'), {ssr: false})


const CheckoutPage = () => {
  const router = useRouter()
  const userData = useSelector((state: RootState) => state.user.userData)
  const cartData = useSelector((state: RootState) => state.cart.cartData)
  const subTotal = useSelector((state: RootState) => state.cart.subTotal ?? 0)
  const deliveryCharge = useSelector((state: RootState) => state.cart.deliveryCharge ?? 0)
  const total = useSelector((state: RootState) => state.cart.total ?? 0)
  const [address, setAddress] = useState({
    name: userData?.name || '',
    mobile: userData?.mobile || '',
    city: '',
    state: '',
    pinCode: '',
    fullAddress: '',
  })

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({...prev, name: userData.name || ''}))
      setAddress((prev) => ({...prev, mobile: userData.mobile || ''}))
    }
  }, [userData])

  const [position, setPosition] = useState<[number, number] | null>(null)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }
  }, [])

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }
  }

  useEffect(() => {
    const fetchAddress = async () => {
      if(!position) return 
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`)
        //console.log(res.data)
        setAddress((prev) => ({
          ...prev,
          fullAddress: res.data.display_name || '',
          city: res.data.address.city || res.data.address.town || res.data.address.village || '',
          state: res.data.address.state || '',
          pinCode: res.data.address.postcode || '',
        }))
      } catch (error) {
        console.log(error)
      }
    }
    fetchAddress()
  }, [position])

  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const handleSearchQuery = async () => {
    if(!searchQuery) return
    setSearchLoading(true)
    try {
      // const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`)
      // if(res.data.length > 0) {
      //   const lat = parseFloat(res.data[0].lat)
      //   const lon = parseFloat(res.data[0].lon)
      //   setPosition([lat, lon])
      // } else alert('Location not found')
      const {OpenStreetMapProvider} = await import('leaflet-geosearch')
      const provider = new OpenStreetMapProvider();
      const res = await provider.search({ query: searchQuery });
      //console.log(res)
      if(res.length > 0) setPosition([res[0].y, res[0].x])
      else alert('Location not found')
      setSearchLoading(false)
    } catch (error) { console.log(error); setSearchLoading(false) }
  }

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod')
  const dispatch = useDispatch()

  const handleCod = async () => {
    if(!userData?._id) return alert('User data not loaded. Please refresh the page.')
    if(!position) return alert('Please select delivery location on map')
    if(!cartData || cartData.length === 0) return alert('Cart is empty')
    try {
      const res = await axios.post('/api/user/order', {
        userId: userData._id,
        items: cartData.map((item) => ({
          groceryId: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.qty,
        })),
        totalAmount: total,
        paymentMethod: 'cod',
        address: {
          name: address.name,
          mobile: address.mobile,
          fullAddress: address.fullAddress,
          city: address.city,
          state: address.state,
          pinCode: address.pinCode,
          latitude: position[0],
          longitude: position[1],
        },
      })
      if(res.status === 201) {
        alert('Order placed successfully')
        console.log('Order response:', res.data)
        // clear cart in redux and localStorage
        dispatch(clearCart())
        router.push('/user/order-success')
      } else alert('Failed to place order')
    } catch (error) { console.log(error); alert('Failed to place order') }
  }

  const handleOnlinePayment = async () => {
    if(!userData?._id) return alert('User data not loaded. Please refresh the page.')
    if(!position) return alert('Please select delivery location on map')
    if(!cartData || cartData.length === 0) return alert('Cart is empty')
    try {
      const res = await axios.post('/api/user/payment', {
        userId: userData?._id,
        items: cartData?.map((item) => ({
          groceryId: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.qty,
        })),
        totalAmount: total,
        paymentMethod: 'online',
        address: {
          name: address.name,
          mobile: address.mobile,
          fullAddress: address.fullAddress,
          city: address.city,
          state: address.state,
          pinCode: address.pinCode,
          latitude: position[0],
          longitude: position[1],
        },
      })
      window.location.href = res.data.url
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-[95%] sm:w-[90%] mx-auto py-10 relative'>
      <Link href={'/user/cart'} className='absolute left-0 top-3 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-all active:scale-95'>
        <ArrowLeft size={20} />
        <span className='hidden sm:inline'>Back to Cart</span>
      </Link>
      <motion.h1
        className="text-3xl md:text-4xl font-bold font-serif text-green-700 text-center mb-7"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Checkout
      </motion.h1>
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100'
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={24} className='text-green-600' />
            Delivery Address
          </h2>
          <div className="space-y-2">
            <div className="relative">
              <User size={18} className='absolute left-3 top-1/2 text-green-600' />
              <label htmlFor="name" className="mb-1 px-1 font-medium text-sm">Name</label>
              <input
                type='text' value={address.name}
                onChange={(e) => setAddress((prev) => ({ ...prev, name: e.target.value }))}
                placeholder='Enter Name'
                className='pl-10 w-full border rounded-lg p-2.5 text-sm bg-gray-50'
              />
            </div>
            <div className="relative">
              <Phone size={18} className='absolute left-3 top-1/2 text-green-600' />
              <label htmlFor="contact" className="mb-1 px-1 font-medium text-sm">Contact</label>
              <input
                type='text' value={address.mobile}
                onChange={(e) => setAddress((prev) => ({ ...prev, mobile: e.target.value }))}
                placeholder='Enter Mobile Number'
                className='pl-10 w-full border rounded-lg p-2.5 text-sm bg-gray-50'
              />
            </div>
            <div className="relative">
              <Home size={18} className='absolute left-3 top-1/2 text-green-600' />
              <label htmlFor="full-address" className="mb-1 px-1 font-medium text-sm">Full Address</label>
              <input
                type='text' value={address.fullAddress}
                onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                placeholder='eg: Kolkata,Jadavpur, s.c mallick road, university gate no. 1'
                className='pl-10 w-full border rounded-lg p-2.5 text-sm bg-gray-50'
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building size={18} className='absolute left-3 top-1/2 text-green-600' />
                <label htmlFor="city" className="mb-1 px-1 font-medium text-sm">City</label>
                <input
                  type='text' value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder='Enter City'
                  className='pl-10 w-full border rounded-lg p-2.5 text-sm bg-gray-50'
                />
              </div>
              <div className="relative">
                <Navigation size={18} className='absolute left-3 top-1/2 text-green-600' />
                <label htmlFor="state" className="mb-1 px-1 font-medium text-sm">State</label>
                <input
                  type='text' value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder='Enter state'
                  className='pl-10 w-full border rounded-lg p-2.5 text-sm bg-gray-50'
                />
              </div>
              <div className="relative">
                <PinIcon size={18} className='absolute left-3 top-1/2 text-green-600' />
                <label htmlFor="contact" className="mb-1 px-1 font-medium text-sm">Contact</label>
                <input
                  type='text' value={address.pinCode}
                  onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                  placeholder='Enter Pin Code'
                  className='pl-10 w-full border rounded-lg p-2.5 text-sm bg-gray-50'
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3 relative">
              <Search size={18} className='text-gray-600 absolute left-1 top-1/2 -translate-y-1/2' />
              <input 
                type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border rounded-lg py-3 px-7 text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                placeholder='Search city or area..' 
              />
              <button 
                onClick={handleSearchQuery}
                className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium cursor-pointer">
                  { searchLoading ? <Loader size={20} className='animate-spin'/> : 'Search' }
              </button>
            </div>
            <div className="relative mt-6 h-72 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              {position && <CheckoutMap position={position} setPosition={setPosition}/>}
              <motion.button
                onClick={(e) => { handleCurrentLocation() }}
                className="absolute right-2 bottom-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all font-medium cursor-pointer active:scale-95 z-9999"
              >
                <LocateFixed size={18} className='inline-block mr-1' />
              </motion.button>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 h-fit tracking-normal duration-300'
        >
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4 gap-2"><CreditCard className='text-green-600'/> Payment Methods</h2>
          <div className="space-y-4 mb-4">
            <button
              onClick={() => setPaymentMethod('online')}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 text-sm hover:bg-gray-50 transition-all ${paymentMethod == 'online' ? 'border-green-600 bg-green-100' : 'border-gray-200'}`}
            >
              <CreditCard size={18} className='text-green-600' />
              <span className="text-gray-700">Pay Online(stripe)</span>
            </button>
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 text-sm hover:bg-gray-50 transition-all ${paymentMethod == 'cod' ? 'border-green-600 bg-green-100' : 'border-gray-200'}`}
            >
              <Truck size={18} className='text-green-600' />
              <span className="text-gray-700">Cash on Delivery</span>
            </button>
          </div>
          <div className="border-t pt-4 space-y-2 text-sm sm:text-base text-gray-700 ">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className='text-green-600'>₹{subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className='text-green-600'>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 border-t pt-3">
              <span>Final Total</span>
              <span className='text-green-600'>₹{total}</span>
            </div>
          </div>
          <button
            onClick={() => {
              if(paymentMethod === 'cod') handleCod()
              else handleOnlinePayment()
            }} 
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-medium active:scale-95 cursor-pointer">
            {paymentMethod === 'online' ? 'Proceed to Pay' : 'Place Order'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutPage