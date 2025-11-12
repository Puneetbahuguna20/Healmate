import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate a PDF prescription from text
 * @param {Object} data - Prescription data
 * @param {string} data.doctorName - Name of the doctor
 * @param {string} data.doctorSpeciality - Speciality of the doctor
 * @param {string} data.patientName - Name of the patient
 * @param {string} data.prescriptionText - Prescription text content
 * @param {Date} data.date - Date of prescription
 * @returns {Promise<string>} - Path to the generated PDF file
 */
const generatePrescriptionPDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `prescription_${timestamp}.pdf`;
      const uploadsDir = path.join(__dirname, '../uploads');
      
      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filePath = path.join(uploadsDir, filename);
      
      // Create a PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Prescription for ${data.patientName}`,
          Author: data.doctorName,
        }
      });
      
      // Pipe the PDF to a file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      
      // Add a header with logo or clinic name
      doc.fontSize(20).text('HealMate Medical Center', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text('Medical Prescription', { align: 'center' });
      doc.moveDown(2);
      
      // Add doctor information
      doc.fontSize(12).text(`Doctor: ${data.doctorName}`, { continued: true });
      doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, { align: 'right' });
      doc.fontSize(10).text(`Speciality: ${data.doctorSpeciality}`);
      doc.moveDown();
      
      // Add patient information
      doc.fontSize(12).text(`Patient: ${data.patientName}`);
      doc.moveDown(2);
      
      // Add a horizontal line
      doc.moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke();
      doc.moveDown();
      
      // Add prescription content
      doc.fontSize(12).text('Prescription:', { underline: true });
      doc.moveDown();
      doc.fontSize(10).text(data.prescriptionText);
      doc.moveDown(2);
      
      // Add a footer with signature
      doc.fontSize(10).text('Doctor\'s Signature:', { align: 'right' });
      doc.moveDown();
      doc.fontSize(12).text(data.doctorName, { align: 'right' });
      
      // Finalize the PDF
      doc.end();
      
      // When the stream is finished, resolve with the file path
      stream.on('finish', () => {
        resolve(`/uploads/${filename}`);
      });
      
      stream.on('error', (err) => {
        reject(err);
      });
      
    } catch (error) {
      reject(error);
    }
  });
};

export { generatePrescriptionPDF };