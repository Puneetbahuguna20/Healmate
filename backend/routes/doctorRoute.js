import express from "express";
const doctorRouter = express.Router();
import {
  appointmentCancel,
  appointmentComplete,
  appointmentsDoctor,
  doctorDashboard,
  doctorList,
  doctorLogin,
  doctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import {
  addPrescription,
  getDoctorPrescriptions,
  getPrescription,
  getPatientPrescriptions,
} from "../controllers/prescriptionController.js";
import authDoctor from "../middlewares/authDoctor.js";
import upload from "../middlewares/multer.js";

// all doctor api
doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

// Prescription routes
doctorRouter.post("/add-prescription", authDoctor, upload.single("prescriptionFile"), addPrescription);
doctorRouter.get("/prescriptions", authDoctor, getDoctorPrescriptions);
doctorRouter.get("/prescription/:prescriptionId", authDoctor, getPrescription);
doctorRouter.get("/patient-prescriptions/:patientId", authDoctor, getPatientPrescriptions);

export default doctorRouter;