import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  doctorId: { type: String, required: true },
  patientId: { type: String, required: true },
  prescriptionText: { type: String, default: "" },
  prescriptionFile: { type: String, default: "" },
  prescriptionType: { type: String, enum: ["text", "file", "both"], required: true },
  createdAt: { type: Date, default: Date.now },
  doctorData: { type: Object, required: true },
  patientData: { type: Object, required: true },
});

const prescriptionModel =
  mongoose.models.prescription ||
  mongoose.model("prescription", prescriptionSchema);

export default prescriptionModel;