import React, { useState } from 'react';
import { format } from 'date-fns';

const PrescriptionCard = ({ prescription }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const downloadPrescription = () => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
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

      {prescription.prescriptionType === 'text' || prescription.prescriptionType === 'both' ? (
        <div className={`p-4 ${expanded ? 'max-h-full' : 'max-h-60 overflow-hidden relative'}`}>
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
          {!expanded && prescription.prescriptionText && prescription.prescriptionText.length > 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
          )}
          {prescription.prescriptionText && prescription.prescriptionText.length > 100 && (
            <button
              onClick={toggleExpand}
              className="text-blue-500 hover:text-blue-700 text-sm mt-2 focus:outline-none block w-full text-center"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      ) : null}

      <div className="p-4 bg-gray-50 flex justify-between items-center">
        {prescription.prescriptionFile ? (
          <button
            onClick={downloadPrescription}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Prescription PDF
          </button>
        ) : (
          <span className="text-gray-500 italic">No PDF available</span>
        )}
      </div>
    </div>
  );
};

export default PrescriptionCard;