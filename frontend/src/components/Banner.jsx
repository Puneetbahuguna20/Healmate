import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <section className='md:mx-10 my-8'>
      <div className='relative overflow-hidden bg-primary rounded-2xl px-6 sm:px-10 md:px-14 lg:px-16 shadow-md'>
        <div className='grid md:grid-cols-2 gap-6 items-center'>
          {/* Left side */}
          <div className='py-10 md:py-16'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight'>
              Book Appointment
              <br />
              With 100+ Trusted Doctors
            </h2>

            <button
              onClick={() => {
                navigate('/login')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className='bg-white text-sm sm:text-base text-gray-700 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-transform'
            >
              Create Account
            </button>

            {/* quick search */}
            <div className='mt-4 bg-white/90 rounded-full flex items-center gap-3 px-4 py-2 w-full max-w-md shadow-sm'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='text-gray-500'>
                <path d='M11 4a7 7 0 105.292 12.292l3.707 3.707 1.414-1.414-3.707-3.707A7 7 0 0011 4z' fill='currentColor' />
              </svg>
              <input aria-label='Search specialties' placeholder='Search specialties or doctors...' className='flex-1 outline-none text-sm text-gray-700 bg-transparent' />
            </div>
          </div>

          {/* Right side */}
          <div className='relative hidden md:block'>
            <div className='absolute -top-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-2xl' />
            <img className='relative w-full max-w-md md:max-w-lg h-auto rounded-2xl' src={assets.appointment_img} alt='' />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner