import React, { useState } from "react";
import { FaDownload, FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const PrescriptionForm = ({ patientData, appointmentId, backendUrl, token }) => {
  const [formData, setFormData] = useState({
    firstName: patientData?.name?.split(' ')[0] || '',
    lastName: patientData?.name?.split(' ')[1] || '',
    age: '',
    treatment: '',
    medication: '',
    dateSigned: new Date().toISOString().split('T')[0]
  });
  const [medications, setMedications] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  
  const handleAddMedication = () => {
    if (formData.medication.trim()) {
      setMedications([...medications, formData.medication]);
      setFormData(prev => ({ ...prev, medication: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const prescriptionData = new FormData();
      prescriptionData.append('appointmentId', appointmentId);
      
      // Create a formatted prescription text from the form data
      const prescriptionText = `
        Patient: ${formData.firstName} ${formData.lastName}
        Age: ${formData.age}
        Treatment: ${formData.treatment}
        Medications: ${medications.join(', ')}
        Date: ${formData.dateSigned}
      `;
      
      prescriptionData.append('prescriptionText', prescriptionText);
      
      if (selectedFile) {
        prescriptionData.append('prescriptionFile', selectedFile);
      }
      
      await axios.post(
        `${backendUrl}/api/user/add-prescription`,
        prescriptionData,
        {
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success('Prescription added successfully');
    } catch (error) {
      console.error('Error adding prescription:', error);
      toast.error('Failed to add prescription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Add Prescription</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Patient's Name */}
        <div className="mb-4 mt-4">
          <label className="block text-gray-700 mb-2">Patient's Name:</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="First"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Last"
              required
            />
          </div>
        </div>
        
        {/* Patient's Age */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Patient's Age:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        {/* Treatment */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Treatment:</label>
          <input
            type="text"
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        {/* Rx: Medication */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rx: Medication / Strength / Frequency</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter medication details"
            />
            <button 
              type="button" 
              onClick={handleAddMedication}
              className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Add more
            </button>
          </div>
          {medications.length > 0 && (
            <div className="mt-2 p-2 border border-gray-200 rounded bg-gray-50">
              <h3 className="font-medium mb-1">Your Prescription:</h3>
              <ul className="list-disc pl-5">
                {medications.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Date signed */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date signed:</label>
          <div className="relative">
            <input
              type="date"
              name="dateSigned"
              value={formData.dateSigned}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <div className="absolute right-2 top-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload PDF (Optional)</label>
          <div className="flex items-center gap-2">
            <label className="px-4 py-2 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200">
              Choose File
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <span className="text-gray-500">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={() => {
              // Find the closest modal and trigger its close button
              const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
              if (modal) {
                const closeButton = modal.querySelector('button');
                if (closeButton) closeButton.click();
              }
            }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;