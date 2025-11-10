import React, { useState, useEffect, useContext } from 'react';
import { DoctorContext } from '../context/DontorContext';
import { format } from 'date-fns';

const PatientPrescriptions = ({ patientId, patientName, onClose }) => {
  const { getPatientPrescriptions } = useContext(DoctorContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      const data = await getPatientPrescriptions(patientId);
      setPrescriptions(data);
      setLoading(false);
    };

    fetchPrescriptions();
  }, [patientId, getPatientPrescriptions]);

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const downloadPrescription = (prescription) => {
    if (prescription.prescriptionFile) {
      // Create a temporary anchor element to force download
      const link = document.createElement('a');
      link.href = prescription.prescriptionFile;
      link.setAttribute('download', `prescription_${prescription._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Prescriptions for {patientName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No prescriptions found for this patient.
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Prescription from Dr. {prescription.doctorData?.name || 'Unknown'}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(prescription.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {prescription.doctorData?.speciality || 'Specialist'}
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
    </div>
  );
};

export default PatientPrescriptions;