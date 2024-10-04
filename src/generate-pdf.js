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

const reportData = fs.readFileSync('trufflehog-output.json', 'utf8');
generatePDF(reportData, 'trufflehog-report.pdf');
