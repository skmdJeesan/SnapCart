'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IDelivery } from '../models/delivery.model'
import { getSocket } from '../lib/socket'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import LiveMap from './LiveMap'
import DeliveryChat from './DeliveryChat'
import { Loader } from 'lucide-react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ILocation {
  latitude: number
  longitude: number
}

const DeliveryBoyDashboard = ({ earning, totalEarning, lastSevenDaysEarning }: {earning: number, totalEarning: number, lastSevenDaysEarning: number}) => {
  const [assignment, setAssignment] = useState<IDelivery[] | any[]>([])
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<ILocation>({ latitude: 0, longitude: 0 })
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({ latitude: 0, longitude: 0 })
  const userData = useSelector((state: RootState) => state.user.userData)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [sendOtpLoading, setSendOtpLoading] = useState(false)
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const socket = getSocket()
    if (userData?._id) {
      socket.emit('identity', userData._id)
    }
  }, [userData?._id])

  useEffect(() => {
    const socket = getSocket()
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setDeliveryBoyLocation({ latitude: lat, longitude: lon })
        socket.emit('update-location', { userId: userData?._id, latitude: lat, longitude: lon })
      },
      (err) => { console.log(err) },
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watcher)
  }, [userData?._id])

  const fetchAllAssignments = async () => {
    try {
      const res = await axios.get('/api/delivery/get-assignments')
      setAssignment(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCurrentAssignment = async () => {
    try {
      const res = await axios.get('/api/delivery/current-order')
      if (res.data.active) {
        setActiveOrder(res.data.activeAssignment)
        const location = {
          latitude: res.data.activeAssignment.order.address.latitude,
          longitude: res.data.activeAssignment.order.address.longitude,
        }
        setUserLocation(location)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await Promise.all([fetchAllAssignments(), fetchCurrentAssignment()])
      setIsLoading(false)
    }
    init()
  }, [userData])

  useEffect((): any => {
    const socket = getSocket()
    socket.on('new-assignment', (deliveryAssignment) => {
      setAssignment(prev => [deliveryAssignment, ...prev])
    })
    return () => socket.off('new-assignment')
  }, [])

  const handleAccept = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
      fetchCurrentAssignment()
    } catch (error) {
      console.log(error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/reject-assignment`)
      setAssignment(prev => prev.filter(a => String(a._id) !== id))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect((): any => {
    const socket = getSocket()
    socket.on('update-deliveryBoy-location', ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      })
    })
    return () => socket.off('update-deliveryBoy-location')
  }, [])

  const sendOtp = async () => {
    setSendOtpLoading(true)
    try {
      await axios.post('/api/otp/send', { orderId: activeOrder.order._id })
      setShowOtpBox(true)
    } catch (error) {
      console.log(error)
    } finally {
      setSendOtpLoading(false)
    }
  }

  const verifyOtp = async () => {
    setVerifyOtpLoading(true)
    setOtpError('')
    try {
      await axios.post('/api/otp/verify', { orderId: activeOrder.order._id, otp })
      setActiveOrder(null)
      await fetchCurrentAssignment()
      window.location.reload()
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Invalid OTP. Please try again.'
      setOtpError(message)
    } finally {
      setVerifyOtpLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader size={32} className="animate-spin text-green-600" />
      </div>
    )
  }

  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-32 min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-green-700 mb-2">Active Delivery</h1>
          <p className="text-gray-600 text-sm mb-4">
            order#{activeOrder.order._id.slice(-6)}
          </p>
          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
          </div>
          <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!} />
          <div className="mt-6 bg-white rounded-3xl border shadow p-6">
            {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
              <button
                onClick={sendOtp}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-3xl cursor-pointer flex items-center justify-center"
              >
                {sendOtpLoading
                  ? <Loader size={16} className="animate-spin text-white" />
                  : 'Mark as Delivered'
                }
              </button>
            )}
            {showOtpBox && (
              <div className="mt-4 flex items-center justify-center flex-col">
                <input
                  type="text"
                  className="w-3/4 py-3 border rounded-3xl text-center"
                  placeholder="Enter OTP"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={verifyOtp}
                  className="w-3/4 mt-4 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-3xl cursor-pointer flex items-center justify-center"
                >
                  {verifyOtpLoading
                    ? <Loader size={16} className="animate-spin text-white" />
                    : 'Verify OTP'
                  }
                </button>
                {/* FIX #6: otpError is now properly set in the catch block above. */}
                {otpError && <div className="text-red-600 mt-2">{otpError}</div>}
              </div>
            )}
            {activeOrder.order.deliveryOtpVerification && (
              <div className="text-green-700 text-center font-bold">
                Delivery Completed 🎉
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!activeOrder && assignment.length === 0) {
    const todaysEarning = [
      {
        name: 'Today',
        earning, 
        deliveries: earning/40
      }
    ]
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-green-50 p-6">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">No Active Deliveries 🚛</h2>
          <p className="text-gray-500 mb-5">Stay online to receive new orders</p>
          <div className="bg-white border rounded-xl shadow-xl p-6">
            <h2 className="font-medium text-green-700 mb-2">Today's Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={todaysEarning}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earning" name="Earnings (₹)" />
                <Bar dataKey="deliveries" name="Deliveries" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-gray-700">Total Earnings: <span className="font-bold text-green-600">₹{totalEarning}</span></p>
              <p className="text-gray-700">Last 7 Days Earnings: <span className="font-bold text-green-600">₹{lastSevenDaysEarning}</span></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-200 px-14 py-8">
      <h2 className="text-2xl font-bold mb-4 mt-20">Delivery Assignments</h2>
      {assignment.map(a => (
        <div key={String(a._id)} className="p-5 bg-white rounded-3xl shadow-md mb-4">
          <p className="text-green-600">#{a?.order._id.toString().slice(-6)}</p>
          <p className="text-gray-700">{a.order.address.fullAddress}</p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleAccept(String(a._id))}
              className="bg-green-500 text-white py-2 px-6 rounded-3xl w-40 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(String(a._id))}
              className="bg-red-500 text-white py-2 px-6 rounded-3xl w-40 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DeliveryBoyDashboard