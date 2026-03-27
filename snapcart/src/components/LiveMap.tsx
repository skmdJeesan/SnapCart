import L, { LatLngExpression } from 'leaflet'
import React, { useEffect } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface ILocation {
  latitude: number,
  longitude: number
}

interface IProps {
  userLocation: ILocation,
  deliveryBoyLocation: ILocation,
}

function Recenter({position}: {position: [number, number]}) {
  const map = useMap()
  useEffect(() => {
    if(position[0] !== 0 && position[1] !== 0) {
      map.setView(position, map.getZoom(), {animate: true})
    }
  }, [position, map])
  return null
}

const LiveMap = ({ userLocation, deliveryBoyLocation }: IProps) => {
  const deliveryBoyIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/11060/11060607.png',
    iconSize: [45, 45]
  })
  const userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/7891/7891946.png',
    iconSize: [45, 45]
  })

  const center = [userLocation.latitude, userLocation.longitude]
  return (
    <div className='w-full h-96 rounded-xl overflow-hidden shadow relative'>
      <MapContainer center={center as LatLngExpression} zoom={13} scrollWheelZoom={true} className='w-full h-full'>
        <Recenter position={center as any}/>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>Delivery Address</Popup>
        </Marker>
        {deliveryBoyLocation && (
          <>
            <Marker position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}>
              <Popup>Delivery Boy</Popup>
            </Marker>
            <Polyline
              positions={[
                [userLocation.latitude, userLocation.longitude],
                [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]
              ]}
              pathOptions={{ color: 'green', weight: 3, dashArray: '6 6' }}
            />
          </>
        )}
      </MapContainer>
    </div>
  )
}

export default LiveMap