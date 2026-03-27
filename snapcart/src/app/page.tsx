import React from 'react'
import connectDB from '../lib/db'
import { redirect } from 'next/navigation'
import User from '../models/user.model'
import { auth } from '../auth'
import EditRoleAndMobile from '../components/EditRoleAndMobile'
import Nav from '../components/Nav'
import UserDashboard from '../components/UserDashboard'
import AdminDashboard from '../components/Admin'
import DeliveryBoy from '../components/DeliveryBoy'
import Grocery, { IGrocery } from '../models/grocery.model'
import Footer from '../components/Footer'


async function page(props: {searchParams: Promise<{q: string}>}) {
  const searchParams = await props.searchParams
  await connectDB()
  const session = await auth()
  const user = await User.findById(session?.user?.id)
  if(!user) redirect('/login')
  const isComplete = !user.role || !user.mobile || (!user.mobile && user.role == 'user')
  if(isComplete) return <EditRoleAndMobile />
  const plainUser = JSON.parse(JSON.stringify(user))

  let groceryList:IGrocery[] = []
  if(user.role == 'user') {
    if(searchParams.q) {
      groceryList = await Grocery.find({
        $or: [
          {name: {$regex: searchParams?.q || '', $options: 'i'}},
          {category: {$regex: searchParams?.q || '', $options: 'i'}},
        ]
      })
    } else {
      groceryList = await Grocery.find({})
    }
  }
  return (
    <>
      <Nav user={plainUser}/>
      {(user.role === 'user') ? <UserDashboard groceryList={groceryList}/> : (user.role === 'admin') ? <AdminDashboard /> : <DeliveryBoy />}
      <Footer />
    </>
  )
}

export default page