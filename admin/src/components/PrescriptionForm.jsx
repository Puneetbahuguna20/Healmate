import React, { useState, useContext, useEffect } from "react";
import { DoctorContext } from "../context/DontorContext";
import { toast } from "react-toastify";

const PrescriptionForm = ({ appointmentId, onClose }) => {
  const { addPrescription, getAppointments } = useContext(DoctorContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prescriptionType, setPrescriptionType] = useState("text");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [patientData, setPatientData] = useState(null);
  
  // Enhanced form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    treatment: '',
    medication: '',
    dateSigned: new Date().toISOString().split('T')[0]
  });
  
  const [medications, setMedications] = useState([]);

  // Fetch appointment data to get patient info
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const appointments = await getAppointments();
        const appointment = appointments.find(app => app._id === appointmentId);
        if (appointment && appointment.userData) {
          const nameParts = appointment.userData.name.split(' ');
          setPatientData(appointment.userData);
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            age: appointment.userData.dob ? calculateAge(appointment.userData.dob) : ''
          }));
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };
    
    if (appointmentId) {
      fetchAppointmentData();
    }
  }, [appointmentId]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMedication = () => {
    if (formData.medication.trim()) {
      setMedications([...medications, formData.medication.trim()]);
      setFormData(prev => ({
        ...prev,
        medication: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setPrescriptionFile(file);
        setPrescriptionType("both"); // We'll always have text with our enhanced form
      } else {
        toast.error("Only PDF files are allowed");
        e.target.value = null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.treatment) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Add current medication to the list if it's not empty and not already added
    if (formData.medication.trim() && !medications.includes(formData.medication.trim())) {
      setMedications(prev => [...prev, formData.medication.trim()]);
    }
    
    // Use setTimeout to ensure state update completes before continuing
    setTimeout(async () => {
      setIsSubmitting(true);
      
      // Get the latest medications including any just added
      const allMedications = formData.medication.trim() 
        ? [...medications, formData.medication.trim()]
        : medications;
      
      const formattedPrescriptionText = `
Patient: ${formData.firstName} ${formData.lastName}
Age: ${formData.age}
Treatment: ${formData.treatment}
Medications: ${allMedications.length > 0 ? allMedications.join(', ') : 'None prescribed'}
Date: ${formData.dateSigned}
      `;

      const formDataToSend = new FormData();
      formDataToSend.append("appointmentId", appointmentId);
      formDataToSend.append("prescriptionType", prescriptionFile ? "both" : "text");
      formDataToSend.append("prescriptionText", formattedPrescriptionText);
      
      if (prescriptionFile) {
        formDataToSend.append("prescriptionFile", prescriptionFile);
      }

      const success = await addPrescription(formDataToSend);
      setIsSubmitting(false);
      
      if (success) {
        onClose();
      }
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add Prescription</h2>
        
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
            <label className="block text-gray-700 mb-2">Date:</label>
            <input
              type="date"
              name="dateSigned"
              value={formData.dateSigned}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          {/* Upload PDF */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Upload PDF (Optional)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
              "
            />
            {prescriptionFile && (
              <p className="mt-1 text-sm text-green-600">
                File selected: {prescriptionFile.name}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? "Submitting..." : "Add Prescription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;