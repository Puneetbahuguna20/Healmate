import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DontorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import PrescriptionForm from "../../components/PrescriptionForm";
import PatientPrescriptions from "../../components/PatientPrescriptions";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    getPrescriptions,
  } = useContext(DoctorContext);
  
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showPrescriptionOptions, setShowPrescriptionOptions] = useState(false);
  const [showPatientPrescriptions, setShowPatientPrescriptions] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
      getPrescriptions();
    }
  }, [dToken]);
  
  const handlePatientClick = (appointment) => {
    if (appointment.isCompleted) {
      setSelectedAppointmentId(appointment._id);
      setSelectedPatient({
        id: appointment.userData._id,
        name: appointment.userData.name
      });
      setShowPrescriptionOptions(true);
    }
  };

  const handleAddPrescription = () => {
    setShowPrescriptionOptions(false);
    setShowPrescriptionForm(true);
  };
  
  const handleViewPrescriptions = () => {
    setShowPrescriptionOptions(false);
    setShowPatientPrescriptions(true);
  };
  
  const handleCloseForm = () => {
    setShowPrescriptionForm(false);
    setSelectedAppointmentId(null);
    setSelectedPatient(null);
  };

  const handleCloseOptions = () => {
    setShowPrescriptionOptions(false);
    setSelectedAppointmentId(null);
    setSelectedPatient(null);
  };

  const handleClosePrescriptions = () => {
    setShowPatientPrescriptions(false);
    setSelectedPatient(null);
  };
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll ">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 cursor-pointer"
            key={index}
            onClick={() => handlePatientClick(item)}
          >
            <p className="max-sm:hidden ">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item?.userData.image}
                alt=""
              />
              <p>{item?.userData?.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "Online" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden ">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)} , {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <div className="flex flex-col gap-1">
                <p className="text-green-500 text-xs font-medium">
                  Completed
                </p>
                <div className="flex flex-col gap-1">
                  {/* This button is now handled by the row click */}
                </div>
              </div>
            ) : (
              <div className="flex">
                <img
                  onClick={() => cancelAppointment(item?._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
                <img
                  onClick={() => completeAppointment(item?._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showPrescriptionForm && (
        <PrescriptionForm
          appointmentId={selectedAppointmentId}
          onClose={handleCloseForm}
        />
      )}

      {showPrescriptionOptions && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Options for {selectedPatient.name}</h2>
              <button
                onClick={handleCloseOptions}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleAddPrescription}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New Prescription
              </button>
              <button
                onClick={handleViewPrescriptions}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Previous Prescriptions
              </button>
            </div>
          </div>
        </div>
      )}

      {showPatientPrescriptions && selectedPatient && (
        <PatientPrescriptions
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          onClose={handleClosePrescriptions}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;