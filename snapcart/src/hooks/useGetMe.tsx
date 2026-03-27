import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { setUserData } from '../redux/userSlice'

const useGetMe = () => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const result = await axios.get('/api/me')
        // console.log(result.data)
        dispatch(setUserData(result.data))
      } catch (error) {
        console.error(error)
      }
    }
    fetchMe()
  }, [])
}

export default useGetMe