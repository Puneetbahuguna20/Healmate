import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DontorContext';
import { format } from 'date-fns';
import axios from 'axios';

const DoctorPrescriptions = () => {
  const { dToken, profileData } = useContext(DoctorContext);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [doctorPrescriptions, setDoctorPrescriptions] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (dToken) {
      const fetchPrescriptions = async () => {
        setLoading(true);
        try {
          // Directly fetch only this doctor's prescriptions
          const { data } = await axios.get(
            backendUrl + "/api/doctor/prescriptions",
            { headers: { dToken } }
          );
          
          if (data.success) {
            // Only use prescriptions where doctorData.name exactly matches profileData.name
            if (profileData) {
              const filtered = data.prescriptions.filter(
                p => p.doctorData && p.doctorData.name === profileData.name
              );
              setDoctorPrescriptions(filtered);
            } else {
              setDoctorPrescriptions([]);
            }
          }
        } catch (error) {
          console.error("Error fetching prescriptions:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPrescriptions();
    }
  }, [dToken, profileData, backendUrl]);

  const toggleExpand = (prescriptionId) => {
    setExpanded(prev => ({
      ...prev,
      [prescriptionId]: !prev[prescriptionId]
    }));
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const downloadPrescription = (prescription) => {
    if (prescription.prescriptionFile) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = prescription.prescriptionFile;
      link.download = `prescription_${prescription._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : doctorPrescriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You haven't created any prescriptions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctorPrescriptions.map((prescription) => (
            <div key={prescription._id} className="bg-white rounded-lg shadow-md overflow-hidden border">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Prescription for {prescription.patientData?.name || 'Unknown Patient'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(prescription.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Patient ID: {prescription.patientId}
                </p>
              </div>

              {(prescription.prescriptionType === 'text' || prescription.prescriptionType === 'both') && (
                <div className={`p-4 ${expanded[prescription._id] ? 'max-h-full' : 'max-h-60 overflow-hidden relative'}`}>
                  <div className="mb-4">
                    {prescription.prescriptionText.includes('Medications:') ? (
                      <div>
                        {prescription.prescriptionText.split('\n').map((line, index) => {
                          if (line.includes('Medications:')) {
                            return (
                              <div key={index} className="mt-2">
                                <h4 className="font-medium text-gray-800">{line.split(':')[0]}:</h4>
                                <p className="text-gray-700 ml-2">{line.split(':')[1]}</p>
                              </div>
                            );
                          } else {
                            return <p key={index} className="text-gray-700">{line}</p>;
                          }
                        })}
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                        {prescription.prescriptionText}
                      </pre>
                    )}
                  </div>
                  {!expanded[prescription._id] && prescription.prescriptionText && prescription.prescriptionText.length > 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
                  )}
                  {prescription.prescriptionText && prescription.prescriptionText.length > 100 && (
                    <button
                      onClick={() => toggleExpand(prescription._id)}
                      className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium block w-full text-center"
                    >
                      {expanded[prescription._id] ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              )}

              <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                {(prescription.prescriptionType === 'file' || prescription.prescriptionType === 'both') ? (
                  <button
                    onClick={() => downloadPrescription(prescription)}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Prescription PDF
                  </button>
                ) : (
                  <span className="text-gray-500 italic">No PDF available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;