import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate a PDF prescription from text
 * @param {Object} data - Prescription data
 * @param {string} data.doctorName - Name of the doctor
 * @param {string} data.doctorSpeciality - Speciality of the doctor
 * @param {string} data.patientName - Name of the patient
 * @param {string} data.patientAge - Age of the patient (optional)
 * @param {string} data.treatment - Treatment description (optional)
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
      
      // Add a header with doctor name and date
      doc.fontSize(16).text(`Prescription from Dr. ${data.doctorName}`, { align: 'left' });
      doc.fontSize(12).text(new Date(data.date).toLocaleDateString(), { align: 'right' });
      doc.moveDown(0.5);
      
      // Add doctor speciality
      doc.fontSize(12).text(data.doctorSpeciality, { align: 'left' });
      doc.moveDown(1);
      
      // Add a horizontal line
      doc.moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke();
      doc.moveDown(1);
      
      // Add patient information
      doc.fontSize(12).text(`Patient: ${data.patientName}`);
      
      // Add patient age if available
      if (data.patientAge) {
        doc.fontSize(12).text(`Age: ${data.patientAge}`);
      }
      
      // Add treatment if available
      if (data.treatment) {
        doc.fontSize(12).text(`Treatment: ${data.treatment}`);
      }
      
      doc.moveDown(1);
      
      // Parse and add medications if available
      let medications = [];
      let otherText = data.prescriptionText;
      
      if (data.prescriptionText.includes('Medications:')) {
        const lines = data.prescriptionText.split('\n');
        let medicationSection = false;
        
        for (const line of lines) {
          if (line.includes('Medications:')) {
            medicationSection = true;
            medications.push(line);
          } else if (medicationSection && line.trim()) {
            medications.push(line);
          }
        }
        
        // Remove medications section from other text
        otherText = lines.filter(line => !medications.includes(line)).join('\n');
      }
      
      // Add medications section
      if (medications.length > 0) {
        doc.fontSize(14).text('Medications:', { underline: true });
        doc.moveDown(0.5);
        
        medications.forEach((med, index) => {
          if (index === 0 && med.includes('Medications:')) {
            // Skip the "Medications:" header line
            const medText = med.split(':')[1].trim();
            if (medText) {
              doc.fontSize(12).text(`• ${medText}`);
            }
          } else {
            doc.fontSize(12).text(`• ${med.trim()}`);
          }
        });
        
        doc.moveDown(1);
      }
      
      // Add other prescription content if any
      if (otherText.trim()) {
        doc.fontSize(12).text(otherText.trim());
        doc.moveDown(1);
      }
      
      // Add date
      doc.fontSize(12).text(`Date: ${new Date(data.date).toLocaleDateString()}`);
      doc.moveDown(2);
      
      // Add a footer with signature
      doc.fontSize(12).text('Doctor\'s Signature:', { align: 'right' });
      doc.moveDown(0.5);
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