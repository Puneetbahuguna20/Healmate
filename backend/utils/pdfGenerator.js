import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
      const rawText = String(data.prescriptionText || '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '')
        .replace(/\u00D0/g, '')
        .trim();
      const medsMatch = rawText.match(/Medications:\s*([^\n]*)/i);
      const meds = medsMatch ? medsMatch[1].split(/[;,]+/).map(s => s.trim()).filter(Boolean) : [];
      const cleanText = rawText.replace(/Medications:[^\n]*/i, '').trim();
      if (cleanText) {
        doc.fontSize(10).text(cleanText);
        doc.moveDown();
      }
      if (meds.length) {
        doc.fontSize(12).text('Medications:', { underline: true });
        doc.moveDown(0.5);
        meds.forEach(m => {
          doc.fontSize(10).text(m);
        });
        doc.moveDown();
      }
      doc.moveDown(2);
      
      // Add a footer with signature
      const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const bottomY = doc.page.height - doc.page.margins.bottom - 60;
      doc.fontSize(10).text('Doctor\'s Signature:', doc.page.margins.left, bottomY, { width, align: 'right' });
      doc.fontSize(12).text(data.doctorName, doc.page.margins.left, bottomY + 20, { width, align: 'right' });
      
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
