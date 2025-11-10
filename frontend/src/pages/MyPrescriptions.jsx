import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import PrescriptionCard from '../components/PrescriptionCard';
import { Link } from 'react-router-dom';

const MyPrescriptions = () => {
  const { token, prescriptions, getUserPrescriptions } = useContext(AppContext);

  useEffect(() => {
    if (token) {
      getUserPrescriptions();
    }
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Prescriptions</h1>
        
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">You don't have any prescriptions yet.</p>
            <Link to="/appointments" className="text-blue-500 hover:text-blue-700">
              View your appointments
            </Link>
          </div>
        ) : (
          <div>
            {prescriptions.map((prescription) => (
              <PrescriptionCard key={prescription._id} prescription={prescription} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;