import connectDB from '../lib/db'
import Grocery, { IGrocery } from '../models/grocery.model'
import CategorySlider from './CategorySlider'
import GroceryCard from './GroceryCard'
import UserHeropage from './UserHeropage'

async function UserDashboard({groceryList}: {groceryList: IGrocery[]}) {
  await connectDB()
  //const groceries = await Grocery.find({})
  const plainGroceries = JSON.parse(JSON.stringify(groceryList))
  return (
    <>
      <UserHeropage />
      <CategorySlider />
      <div className="w-[90%] mx-auto mt-10 min-h-screen">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">Popular Grocery Items</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
          {plainGroceries.map((item: any) => (
            <GroceryCard key={item._id} item={item}/>
          ))}
          {plainGroceries.length === 0 && <div className='w-[85vw] flex justify-center mt-20'>
            <h2 className='text-gray-600'>No such item is found!</h2>
          </div>}
        </div>
      </div>
    </>
  )
}

export default UserDashboard