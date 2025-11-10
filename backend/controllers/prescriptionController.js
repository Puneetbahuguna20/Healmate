import prescriptionModel from "../models/prescriptionModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import path from "path";
import { generatePrescriptionPDF } from "../utils/pdfGenerator.js";

// Add prescription (text or file)
const addPrescription = async (req, res) => {
  try {
    const { appointmentId, prescriptionText, prescriptionType } = req.body;
    const docId = req.docId; // From middleware

    // Validate appointment exists and belongs to this doctor
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointment.docId !== docId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // Get doctor and patient data
    const doctorData = await doctorModel.findById(docId).select("-password");
    const patientData = await userModel.findById(appointment.userId).select("-password");

    // Create prescription object
    const prescriptionData = {
      appointmentId,
      doctorId: docId,
      patientId: appointment.userId,
      prescriptionText: prescriptionText || "",
      prescriptionFile: req.file ? req.file.filename : "",
      prescriptionType: prescriptionType || (req.file ? "file" : "text"),
      doctorData,
      patientData,
    };

    // If both text and file are provided
    if (prescriptionText && req.file) {
      prescriptionData.prescriptionType = "both";
    }

    // Generate PDF from text if type is text only or both
     if (prescriptionText && (prescriptionType === "text" || prescriptionType === "both")) {
       try {
         // Parse prescription text to extract treatment and age if available
         let patientAge = "";
         let treatment = "";
         
         const lines = prescriptionText.split('\n');
         for (const line of lines) {
           if (line.includes('Age:')) {
             patientAge = line.split(':')[1].trim();
           } else if (line.includes('Treatment:')) {
             treatment = line.split(':')[1].trim();
           }
         }
         
         const pdfPath = await generatePrescriptionPDF({
           doctorName: doctorData.name,
           doctorSpeciality: doctorData.speciality,
           patientName: patientData.name,
           patientAge,
           treatment,
           prescriptionText,
           date: new Date(),
         });
         
         prescriptionData.prescriptionFile = pdfPath;
         prescriptionData.prescriptionType = "both"; // Update type since we now have both text and PDF
       } catch (pdfError) {
         console.error("Error generating PDF:", pdfError);
         // Continue without PDF if generation fails
       }
     }

    // Save prescription
    const newPrescription = new prescriptionModel(prescriptionData);
    await newPrescription.save();

    // Mark appointment as completed if not already
    if (!appointment.isCompleted) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
    }

    res.json({ success: true, message: "Prescription added successfully" });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get prescriptions for doctor
const getDoctorPrescriptions = async (req, res) => {
  try {
    const docId = req.docId;
    console.log("Doctor ID from request:", docId);
    
    // Find the doctor to get their name
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    
    // Find prescriptions where doctorId matches OR doctorData.name matches
    const prescriptions = await prescriptionModel.find({ 
      $or: [
        { doctorId: docId },
        { "doctorData.name": doctor.name }
      ]
    });
    
    console.log(`Found ${prescriptions.length} prescriptions for doctor ${doctor.name}`);
    
    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get prescriptions for patient
const getPatientPrescriptions = async (req, res) => {
  try {
    // If request is from doctor route, use patientId from params
    // If request is from patient route, use userId from auth
    const patientId = req.params.patientId || req.userId;

    const prescriptions = await prescriptionModel.find({ patientId });

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get a specific prescription
const getPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const prescription = await prescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.json({ success: false, message: "Prescription not found" });
    }

    res.json({ success: true, prescription });
  } catch (error) {
    console.log("error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getPrescription,
};