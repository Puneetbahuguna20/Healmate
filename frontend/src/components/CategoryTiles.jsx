import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets, specialityData } from '../assets/assets'

const CategoryTiles = () => {
  const navigate = useNavigate()
  return (
    <section className="md:mx-10 my-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Browse by Specialty</h2>
          <p className="text-gray-600">Jump straight to what you need.</p>
        </div>
        <button onClick={()=>{navigate('/'); window.scrollTo({top:0, behavior:'smooth'})}}
          className="text-sm px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50">View all</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {specialityData.map((item, idx) => (
          <button key={idx} onClick={()=>{navigate('/'); window.scrollTo({top:0, behavior:'smooth'})}}
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <img src={item.image} alt={item.speciality} className="w-12 h-12 rounded-full object-cover" />
            <span className="mt-3 text-sm font-medium text-gray-800 group-hover:text-primary">{item.speciality}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default CategoryTiles