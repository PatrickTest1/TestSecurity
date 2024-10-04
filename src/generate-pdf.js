// src/generate-pdf.js

const fs = require('fs');
const PDFDocument = require('pdfkit');

function generatePDF(reportData, outputPath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.text('Trufflehog Vulnerabilities Report', { align: 'center' });
  doc.moveDown();
  doc.text(reportData);

  doc.end();
}

try {
  const reportData = fs.readFileSync('trufflehog-output.json', 'utf8');
  generatePDF(reportData, 'trufflehog-report.pdf');
  console.log('PDF report generated successfully.');
} catch (error) {
  console.error('Error generating PDF:', error);
  process.exit(1); // Assurez-vous que le workflow échoue en cas d'erreur
}
