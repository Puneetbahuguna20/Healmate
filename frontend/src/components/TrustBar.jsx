import React from 'react'

const TrustBar = () => {
  const items = [
    {
      title: 'Verified Doctors',
      desc: 'Qualified and vetted professionals',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7l3-7z" fill="currentColor" />
        </svg>
      )
    },
    {
      title: 'Easy Booking',
      desc: 'Schedule in seconds',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 012 0v1zM5 9h14v11H5V9zm4 3h2v2H9v-2z" fill="currentColor" />
        </svg>
      )
    },
    {
      title: '24/7 Support',
      desc: 'We’re here anytime',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 .999-1.732L13 12V7z" fill="currentColor" />
        </svg>
      )
    }
  ]

  return (
    <div className="md:mx-10 my-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/70 shadow-sm p-4">
            <div className="shrink-0">{item.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrustBar