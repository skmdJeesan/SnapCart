'use client'
import React, { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store'
import { hydrate } from './cartSlice'

const HydrateStore = ({children}: {children: React.ReactNode}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        dispatch(hydrate(cartData))
      } catch (error) {
        console.error('Failed to hydrate cart:', error)
      }
    }
  }, [dispatch])

  return <>{children}</>
}

const StoreProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <Provider store={store}>
      <HydrateStore>{children}</HydrateStore>
    </Provider>
  )
}

export default StoreProvider