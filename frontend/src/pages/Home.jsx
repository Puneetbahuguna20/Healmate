import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import TrustBar from '../components/TrustBar'
import HomeHighlights from '../components/HomeHighlights'


const Home = () => {
  return (
    <main className="bg-gray-50">
      {/* Hero sections (primary color retained) */}
      <section className="md:mx-10 pt-6">
        <Header />
      </section>
      <section className="md:mx-10 mt-6">
        <Banner />
      </section>

      {/* Credibility + highlights in a card-like panel */}
      <section className="md:mx-10 mt-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <TrustBar />
          <div className="mt-6">
            <HomeHighlights />
          </div>
        </div>
      </section>

      {/* Specialties section with anchor for header CTA */}
      <section id="speciality" className="md:mx-10 my-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Featured Specialties</h2>
            <p className="text-sm text-gray-600">Find care by category</p>
          </div>
          <SpecialityMenu />
        </div>
      </section>

      {/* Top doctors section */}
      <section className="md:mx-10 my-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Top Doctors</h2>
            <p className="text-sm text-gray-600">Handpicked practitioners you can trust</p>
          </div>
          <TopDoctors />
        </div>
      </section>
    </main>
  )
}

export default Home
