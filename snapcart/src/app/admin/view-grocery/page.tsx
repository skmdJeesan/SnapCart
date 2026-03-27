'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import axios from 'axios'
import { ArrowLeft, Package, Pencil, Search, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IGrocery } from '@/src/models/grocery.model'
import Image from 'next/image'

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care"
]

const units = ['kg', 'g', 'liter', 'ml', 'piece', 'pack']

const ViewGroceryPage = () => {
  const router = useRouter()
  const [groceries, setGroceries] = useState<IGrocery[]>()
  const [filtered, setFiltered] = useState<IGrocery[]>()
  const [editing, setEditing] = useState<IGrocery | null>(null)
  const [search, setSearch] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [backendImage, setBackendImage] = useState<Blob | null>(null)

  useEffect(() => {
    const getAllGroceries = async () => {
      try {
        const res = await axios.get('/api/admin/get-groceries')
        setGroceries(res.data)
        setFiltered(res.data)
        //console.log(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllGroceries()
  }, [])

  useEffect(() => {
    if (editing) setImagePreview(editing.image)
  }, [editing])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      setBackendImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEdit = async () => {
    if(!editing) return
    try {
      const formData = new FormData()
      formData.append('name', editing.name)
      formData.append('groceryId', editing?._id?.toString()!)
      formData.append('category', editing.category)
      formData.append('unit', editing.unit)
      formData.append('price', editing.price)
      if(backendImage) formData.append('image', backendImage)
      const res = await axios.post('/api/admin/edit-grocery', formData)
      window.location.reload()
      //console.log(result.data)
      //setEditing(null)
    } catch (error) {
      
    }
  }

  const deleteGrocery = async () => {
    if(!editing) return
    try {
      const res = await axios.post('/api/admin/delete-grocery', {groceryId: editing?._id})
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.toLowerCase()
    setFiltered(
      groceries?.filter((g) => (g.category.toLowerCase().includes(q) || g.name.toLowerCase().includes(q)))
    )
  }

  return (
    <div className='pt-4 w-[95%] md:w-[85%] mx-auto pb-20'>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-center sm:text-left"
      >
        <button
          onClick={() => router.push("/")}
          className='cursor-pointer flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto'
        ><ArrowLeft size={18} /><span>Back</span>
        </button>
        <h1 className='text-2xl font-extrabold text-green-700 flex items-center justify-center gap-2'>
          <Package size={26} className='text-green-600' />Manage Groceries
        </h1>
      </motion.div>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center bg-white rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg max-w-2xl mx-auto w-full"
        onSubmit={handleSearch}
      >
        <Search className='text-gray-500 w-5 h-5 mr-2' />
        <input 
          type="text" value={search}
          onChange={(e) => setSearch(e.target.value)} 
          className='w-full outline-none text-gray-700 placeholder-gray-400'
          placeholder='Search by name or category....'
        />
      </motion.form>
      <div className="space-y-4">
        {filtered?.map((g, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className='bg-white rounded-3xl shadow-md hover:shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5'
          >
            <div className='relative w-full sm:w-40 aspect-square rounded-xl overflow-hidden'>
              <Image
                src={g.image} alt={g.name}
                fill className='object-cover hover:scale-110 transition-transform duration-500'
              />
            </div>
            <div className='flex-1 flex flex-col justify-between w-full'>
              <div>
                <h3 className='font-semibold text-gray-800 text-1g truncate'>{g.name}</h3>
                <p className='text-gray-500 text-sm capitalize'>{g.category}</p>
              </div>
              <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                <p className='text-green-700 font-bold text-lg'>
                  {g.price}/ <span className='text-gray-500 text-sm font-medium ml-1'>{g.unit}</span>
                </p>
                <button
                  onClick={() => setEditing(g)}
                  className='bg-green-600 text-white px-4 py-2 rounded-xl cursor-pointer text-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700'
                ><Pencil size={15} /> Edit</button>
              </div>
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {editing &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4'
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative'
              >
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-2x1 font-bold text-green-700'>Edit Grocery</h2>
                  <button className='text-gray-600 hover:text-red-600' onClick={() => setEditing(null)}>
                    <X size={18} />
                  </button>
                </div>
                <div className='relative aspect-square w-full rounded-xl overflow-hidden mb-4 group border border-gray-200'>
                  {imagePreview && <Image
                    src={imagePreview}
                    alt={editing.name}
                    fill className='object-cover'
                  />}
                  <label htmlFor='imageUpload' className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity'><Upload size={26} className='text-green-500'/></label>
                  <input type='file' accept='image/*' hidden id='imageUpload' onChange={handleImageUpload}/>
                </div>
                <div className="space-y-2">
                  <input 
                    type="text"
                    placeholder='Enter Grocery Name'
                    value={editing.name}
                    onChange={(e) => setEditing({...editing, name: e.target.value})}
                    className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-200 outline-none' 
                  />
                  <select 
                    value={editing.category}
                    onChange={(e) => setEditing({...editing, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-200 outline-none"
                  >
                    <option className='bg-gray-400' disabled>Select Category</option>
                    {categories.map((c,i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                  <input 
                    type="text"
                    placeholder='Price'
                    value={editing.price}
                    onChange={(e) => setEditing({...editing, price: e.target.value})}
                    className='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-200 outline-none' 
                  />
                  <select 
                    value={editing.unit}
                    onChange={(e) => setEditing({...editing, unit: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-200 outline-none"
                  >
                    <option className='bg-gray-400' disabled>Select Unit</option>
                    {units.map((u,i) => (
                      <option key={i} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={handleEdit} 
                    className="px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer flex items-center gap-2"
                  >Update Grocery</button>
                  <button 
                    onClick={deleteGrocery}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 cursor-pointer flex items-center gap-2"
                  >Delete Grocery</button>
                </div>
              </motion.div>

            </motion.div>}
        </AnimatePresence>
      </div>
    </div >
  )
}

export default ViewGroceryPage