'use client'
import React, { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'

const markerIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

type propType = {
  position: [number, number],
  setPosition: (pos: [number, number]) => void
}

const CheckoutMap = ({ position, setPosition }: propType) => {
  const DraggableMarker: React.FC = () => {
  const map = useMap()
  useEffect(() => {
    map.setView(position as LatLngExpression, 15, { animate: true })
  }, [map, position])
  return (
    <Marker
      icon={markerIcon}
      position={position as LatLngExpression}
      draggable={true}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target
          const latLng = marker.getLatLng()
          setPosition([latLng.lat, latLng.lng])
        }
      }}
    />
  )
}
  return (
    <MapContainer center={position as LatLngExpression} zoom={13} scrollWheelZoom={true} className='w-full h-full'>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker />
    </MapContainer>
  )
}

export default CheckoutMap