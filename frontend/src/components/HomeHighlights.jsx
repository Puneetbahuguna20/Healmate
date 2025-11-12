import React from 'react'

const HomeHighlights = () => {
  const cards = [
    {
      title: 'Easy Appointments',
      desc: 'Book visits with a single click and instant confirmation.',
      accent: 'from-pink-500/20 to-red-500/10'
    },
    {
      title: 'Top Specialists',
      desc: 'Browse trusted doctors across popular specialties near you.',
      accent: 'from-blue-500/20 to-indigo-500/10'
    },
    {
      title: 'Secure Prescriptions',
      desc: 'Access and manage prescriptions securely from any device.',
      accent: 'from-teal-500/20 to-emerald-500/10'
    }
  ]

  return (
    <section className="md:mx-10 my-10">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">What Makes Us Different</h2>
        <p className="text-gray-600 mt-2">A clean, familiar experience—refined to be faster and friendlier.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <div key={i} className={`rounded-2xl border border-gray-200 bg-gradient-to-br ${c.accent} p-5 shadow-sm hover:shadow-md transition-shadow`}> 
            <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HomeHighlights