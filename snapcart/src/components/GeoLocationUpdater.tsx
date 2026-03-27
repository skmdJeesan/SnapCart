'use client'
import React, { useEffect } from 'react'
import { getSocket } from '../lib/socket'

const GeoLocationUpdater = ({ userId }: { userId: string }) => {
  let socket = getSocket()
  useEffect(() => {
    if (!userId) return
    if (!navigator.geolocation) return
    const watcher = navigator.geolocation.watchPosition((pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      socket.emit('update-location', { userId, latitude: lat, longitude: lon })
    }, (err) => { console.log(err) }, { enableHighAccuracy: true })
    return () => navigator.geolocation.clearWatch(watcher)
  }, [userId])
  return null
}

export default GeoLocationUpdater