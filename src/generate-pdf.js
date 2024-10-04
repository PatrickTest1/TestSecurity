const fs = require('fs');
const PDFDocument = require('pdfkit');

function generatePDF(reportData, outputPath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text('Trufflehog Vulnerabilities Report', { align: 'center' });
  doc.moveDown();

  reportData.forEach((entry, index) => {
    doc.fontSize(16).text(`Vulnérabilité ${index + 1}`, { underline: true });
    doc.fontSize(12).text(`- Branche : ${entry.branch}`);
    doc.text(`- Commit : ${entry.commit}`);
    doc.text(`- Hash du Commit : ${entry.commitHash}`);
    doc.text(`- Date : ${entry.date}`);
    doc.moveDown();

    doc.text('Détails du Diff:', { bold: true });
    doc.font('Courier').text(entry.diff);
    doc.moveDown();

    doc.text('Raison :', { bold: true });
    doc.text(entry.reason);
    doc.moveDown();

    doc.text('Chaînes Trouvées :', { bold: true });
    entry.stringsFound.forEach(str => {
      doc.text(`• ${str}`);
    });
    doc.addPage();
  });

  doc.end();
}

try {
  const rawData = fs.readFileSync('trufflehog-output.json', 'utf8');
  const jsonData = JSON.parse(rawData);

  // Trufflehog peut retourner un objet ou un tableau en fonction de la version
  // Assurez-vous que jsonData est toujours un tableau
  const reportData = Array.isArray(jsonData) ? jsonData : [jsonData];

  generatePDF(reportData, 'trufflehog-report.pdf');
  console.log('PDF report generated successfully.');
} catch (error) {
  console.error('Error generating PDF:', error);
  process.exit(1); // Assurez-vous que le workflow échoue en cas d'erreur
}
