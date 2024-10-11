const fs = require('fs');
const PDFDocument = require('pdfkit');

function generatePDF(reportData, outputPath) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text('Trufflehog Vulnerabilities Report', { align: 'center' });
  doc.moveDown();

  reportData.forEach((entry, index) => {
    const sourceMeta = entry.SourceMetadata.Data.Github;
    
    // Titre de la vulnérabilité
    doc.fontSize(16).text(`Vulnérabilité ${index + 1}`, { underline: true });
    doc.moveDown(0.5);

    // Informations principales
    doc.fontSize(12).text(`- Repository : ${sourceMeta.repository}`);
    doc.text(`- Commit : ${sourceMeta.commit}`);
    doc.text(`- Auteur du crime : ${sourceMeta.email}`);
    doc.text(`- Date : ${sourceMeta.timestamp}`);
    doc.text(`- Ligne : ${sourceMeta.line}`);
    doc.moveDown();

    // Détails de Diff
    doc.fontSize(14).text('Détails du Diff:', { bold: true, underline: true });
    doc.moveDown(0.5);
    doc.font('Courier').fontSize(10).text(`- Lien vers le commit : ${sourceMeta.link}`);
    doc.moveDown();

    // Type de Détecteur
    doc.fontSize(14).text('Raison :', { bold: true });
    doc.font('Helvetica').fontSize(12).text(`Type : ${entry.DetectorName}`);
    doc.text(`Décodage : ${entry.DecoderName}`);
    doc.text(`Vérifié : ${entry.Verified}`);
    doc.moveDown();

    // Chaînes Trouvées
    doc.fontSize(14).text('Chaînes Trouvées :', { bold: true });
    doc.font('Helvetica').fontSize(12).text(`• Chaîne brute : ${entry.Raw}`);
    doc.text(`• Chaîne masquée : ${entry.Redacted}`);
    
    if (entry.ExtraData && entry.ExtraData.message) {
        doc.text(`• Message : ${entry.ExtraData.message}`);
    }
    doc.moveDown();

    // Ajout d'une nouvelle page pour la prochaine vulnérabilité
    if (index < data.length - 1) {
        doc.addPage();
    }
});

  doc.end();
}

try {
  const rawData = fs.readFileSync('trufflehog-output.json', 'utf-8');
  let jsonData;

  try {
    jsonData = JSON.parse(rawData);
  } catch (parseError) {
    console.error('JSON parsing error:', parseError);
    console.error('Raw Trufflehog output:', rawData);
    process.exit(1);
  }

  const reportData = Array.isArray(jsonData) ? jsonData : [jsonData];

  reportData.forEach((entry, index) => {
    if (entry.msg == "finished scanning" && entry.verified_secrets == 0)
      console.log("No vulnerabilities found, no report neeeded.");
      process.exit(0);
  });

  generatePDF(reportData, 'trufflehog-report.pdf');
  console.log('PDF report generated successfully.');
} catch (error) {
  console.error('Error generating PDF:', error);
  process.exit(1);
}
