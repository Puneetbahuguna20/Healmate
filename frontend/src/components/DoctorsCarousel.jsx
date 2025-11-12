import React from 'react'
import { useNavigate } from 'react-router-dom'
import { doctors } from '../assets/assets'

const DoctorsCarousel = () => {
  const navigate = useNavigate()
  return (
    <section className="md:mx-10 my-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Top Doctors</h2>
          <p className="text-gray-600">Handpicked practitioners you can trust.</p>
        </div>
        <button onClick={()=>{navigate('/'); window.scrollTo({top:0, behavior:'smooth'})}}
          className="text-sm px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50">Browse all</button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max py-2">
          {doctors.slice(0,10).map((doc, idx) => (
            <div key={idx} className="w-64 shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={doc.image} alt={doc.name} className="w-full h-40 object-cover rounded-t-2xl" />
                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">Available</span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900">{doc.name}</p>
                <p className="text-sm text-gray-600">{doc.speciality}</p>
                <button onClick={()=>{navigate('/'); window.scrollTo({top:0, behavior:'smooth'})}}
                  className="mt-3 w-full text-sm px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DoctorsCarousel