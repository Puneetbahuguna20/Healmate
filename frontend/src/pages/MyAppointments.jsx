import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
// Make sure the path is correct
import PrescriptionForm from '../components/PrescriptionForm.jsx'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState(
  []);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token }}
      )
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verify-razorpay',
            response,
            {
              headers: {
                token, // ✅ use correct header name
              },
            }
          );
  
          if (data.success) {
            getUserAppointments();
            navigate('/my-appointments');
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-razorpay',
        { appointmentId },
        {
          headers: {
            token, // ✅ use correct header name
          },
        }
      );
  
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  
  

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  // Debug: Check if there are any completed appointments
  useEffect(() => {
    console.log("All appointments:", appointments);
    const completedAppointments = appointments.filter(app => app.isCompleted);
    console.log("Completed appointments:", completedAppointments);
  }, [appointments])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.length === 0 ? (
          <p className='mt-12 font-medium text-zinc-700 flex justify-center'>No appointments found.</p>
        ) : (
          appointments.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border-rounded text-stone-500 bg-indigo-50'>Paid</button>}
                {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
                {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
                {item.isCompleted && (
                  <>
                    <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>
                    <button 
                      onClick={() => {
                        setSelectedAppointment(item);
                        setShowPrescriptionForm(true);
                        console.log("Opening prescription form for:", item);
                      }} 
                      className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-blue-600 hover:text-white transition-all duration-300'
                    >
                      Add Prescription
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showPrescriptionForm && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Add Prescription for {selectedAppointment.docData?.name || 'Patient'}</h3>
              <button 
                onClick={() => {
                  setShowPrescriptionForm(false);
                  setSelectedAppointment(null);
                  console.log("Closing prescription form");
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              {console.log("Rendering PrescriptionForm with:", {
                patientData: selectedAppointment.userData,
                appointmentId: selectedAppointment._id,
                backendUrl,
                token
              })}
              <PrescriptionForm 
                patientData={selectedAppointment.userData} 
                appointmentId={selectedAppointment._id}
                backendUrl={backendUrl}
                token={token}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments