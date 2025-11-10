import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState([]);
  const [profileData, setProfileData] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };

  const completeAppointment = async (appointmentId) => {
    console.log("appointmentId:", appointmentId);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      console.log("data:", data);
      if (data.success) {
        console.log("data:", data);
        getAppointments();

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        getAppointments();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log("data:", data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };

  // Get prescriptions for doctor
  const getPrescriptions = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/prescriptions",
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        setPrescriptions(data.prescriptions.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
    }
  };
  
  // Get prescriptions for a specific patient
  const getPatientPrescriptions = async (patientId) => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/patient-prescriptions/" + patientId,
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        return data.prescriptions;
      } else {
        toast.error(data.message);
        return [];
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message || "Failed to fetch patient prescriptions");
      return [];
    }
  };

  // Add prescription
  const addPrescription = async (formData) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/add-prescription",
        formData,
        {
          headers: { 
            dToken,
            "Content-Type": "multipart/form-data"
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getPrescriptions();
        getAppointments(); // Refresh appointments as they may be marked completed
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message || "Failed to add prescription");
      return false;
    }
  };

  // Get a specific prescription
  const getPrescription = async (prescriptionId) => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/prescription/" + prescriptionId,
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        return data.prescription;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error);
      return null;
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    prescriptions,
    getPrescriptions,
    addPrescription,
    getPrescription,
    getPatientPrescriptions
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;