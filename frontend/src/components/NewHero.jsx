import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const NewHero = () => {
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden">
      <div className="md:mx-10 my-6 rounded-3xl bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white shadow-xl">
        <div className="grid md:grid-cols-2 gap-6 px-6 sm:px-10 md:px-14 py-12 md:py-16 lg:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Find the right doctor, faster
            </h1>
            <p className="mt-4 text-gray-300 text-sm sm:text-base">
              Explore top specialists and book appointments in seconds with a clean, efficient experience.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={()=>{navigate('/login'); window.scrollTo({top:0, behavior:'smooth'})}}
                className="bg-white text-gray-900 px-6 py-3 rounded-full text-sm sm:text-base hover:scale-105 transition-transform">
                Get Started
              </button>
              <button onClick={()=>{navigate('/contact'); window.scrollTo({top:0, behavior:'smooth'})}}
                className="border border-white/30 text-white px-6 py-3 rounded-full text-sm sm:text-base hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </div>
            <div className="mt-6 bg-white/10 rounded-2xl p-3 backdrop-blur">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/80">
                  <path d="M11 4a7 7 0 105.292 12.292l3.707 3.707 1.414-1.414-3.707-3.707A7 7 0 0011 4z" fill="currentColor" />
                </svg>
                <input aria-label="Search" placeholder="Search specialties or doctors"
                  className="flex-1 bg-transparent outline-none text-white/90 placeholder:text-white/60 text-sm" />
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative flex justify-center">
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-primary/20 blur-2xl rounded-full"/>
              <img src={assets.appointment_img} alt="Appointment" className="relative w-full max-w-md rounded-2xl shadow-lg"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewHero