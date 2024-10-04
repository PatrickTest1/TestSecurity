const fs = require('fs');
const PDFDocument = require('pdfkit');

function generatePDF(reportData, outputPath) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text('Trufflehog Vulnerabilities Report', { align: 'center' });
  doc.moveDown();

  reportData.forEach((entry, index) => {
    doc.fontSize(16).text(`Vulnérabilité ${index + 1}`, { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`- Branche : ${entry.branch}`);
    doc.text(`- Commit : ${entry.commit}`);
    doc.text(`- Hash du Commit : ${entry.commitHash}`);
    doc.text(`- Date : ${entry.date}`);
    doc.moveDown();

    // Détails du Diff
    doc.fontSize(14).text('Détails du Diff:', { bold: true, underline: true });
    doc.moveDown(0.5);
    doc.font('Courier').fontSize(10).text(entry.diff, { continued: false });
    doc.moveDown();

    // Raison
    doc.fontSize(14).text('Raison :', { bold: true });
    doc.font('Helvetica').fontSize(12).text(entry.reason);
    doc.moveDown();

    // Chaînes Trouvées
    doc.fontSize(14).text('Chaînes Trouvées :', { bold: true });
    entry.stringsFound.forEach(str => {
      doc.font('Helvetica').fontSize(12).text(`• ${str}`);
    });
    doc.addPage();
  });

  doc.end();
}

try {
  const rawData = fs.readFileSync('trufflehog-output.json', 'utf8');
  let jsonData;

  // Trufflehog peut retourner un seul objet ou un tableau
  try {
    jsonData = JSON.parse(rawData);
  } catch (parseError) {
    console.error('JSON parsing error:', parseError);
    console.error('Raw Trufflehog output:', rawData);
    process.exit(1);
  }

  // Assurez-vous que jsonData est toujours un tableau
  const reportData = Array.isArray(jsonData) ? jsonData : [jsonData];

  generatePDF(reportData, 'trufflehog-report.pdf');
  console.log('PDF report generated successfully.');
} catch (error) {
  console.error('Error generating PDF:', error);
  process.exit(1); // Assurez-vous que le workflow échoue en cas d'erreur
}
