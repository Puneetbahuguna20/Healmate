import React from 'react'

const Testimonials = () => {
  const quotes = [
    {
      name: 'Aarav',
      text: 'Booking was effortless and I found a great specialist quickly.',
    },
    {
      name: 'Anika',
      text: 'Clean interface and secure prescription access — super convenient!',
    },
    {
      name: 'Rahul',
      text: 'I loved the fast booking and verified doctor profiles.',
    }
  ]

  return (
    <section className="md:mx-10 my-12">
      <div className="rounded-3xl bg-gray-50 border border-gray-200 p-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">What Patients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quotes.map((q, i) => (
            <div key={i} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-700">“{q.text}”</p>
              <p className="mt-3 text-xs text-gray-500">— {q.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials