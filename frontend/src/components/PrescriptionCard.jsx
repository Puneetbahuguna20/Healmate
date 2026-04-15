import React, { useContext, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { AppContext } from '../context/AppContext';

const PrescriptionCard = ({ prescription }) => {
  const [expanded, setExpanded] = useState(false);
  const { backendUrl } = useContext(AppContext);

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

  // Build absolute file URL for viewing/downloading
  const fileUrl = useMemo(() => {
    if (!prescription?.prescriptionFile) return null;
    const href = prescription.prescriptionFile.startsWith('http')
      ? prescription.prescriptionFile
      : `${backendUrl}${prescription.prescriptionFile}`;
    return href;
  }, [prescription?.prescriptionFile, backendUrl]);

  // Parse structured fields from the text, if present
  const parsedFields = useMemo(() => {
    const text = prescription?.prescriptionText || '';
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const out = {};
    lines.forEach(line => {
      const idx = line.indexOf(':');
      if (idx > -1) {
        const key = line.slice(0, idx).toLowerCase();
        const val = line.slice(idx + 1).trim();
        if (key.includes('patient')) out.patient = val;
        else if (key.includes('age')) out.age = val;
        else if (key.includes('treatment')) out.treatment = val;
        else if (key.includes('medications')) out.medications = val;
        else if (key === 'date') out.date = val;
      }
    });
    return out;
  }, [prescription?.prescriptionText]);

  const downloadPrescription = () => {
    if (fileUrl) {
      // Create a link to download the file
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `prescription_${prescription._id}.pdf`;
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          <div>
            <p className="text-gray-500">PATIENT</p>
            <p className="text-gray-900 font-medium">{parsedFields.patient || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">AGE</p>
            <p className="text-gray-900 font-medium">{parsedFields.age || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">TREATMENT</p>
            <p className="text-gray-900 font-medium">{parsedFields.treatment || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">MEDICATIONS</p>
            <p className="text-gray-900 font-medium">{parsedFields.medications || '-'}</p>
          </div>
        </div>
      </div>

      {/* Removed text preview block as requested */}

      {fileUrl && (
        <div className="p-4 bg-gray-50">
          <div className="border rounded overflow-hidden mb-3">
            <iframe
              title={`Prescription ${prescription._id}`}
              src={fileUrl}
              className="w-full h-[360px]"
            />
          </div>
          <button
            onClick={downloadPrescription}
            className="flex items-center text-blue-600 hover:text-blue-800"
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
        </div>
      )}
    </div>
  );
};

export default PrescriptionCard;
