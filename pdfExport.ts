import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Mapping {
  id: string;
  objective: string;
  objectiveName: string;
  principle: string;
  principleName: string;
  itemName: string;
  description: string;
  cafDescription: string;
  isa62443_3_3: string;
  isa62443_4_2: string;
  deviceTypes: string[];
  keywords: string[];
}

interface PDFOptions {
  title?: string;
  includeMetadata?: boolean;
  includeTableOfContents?: boolean;
}

/**
 * Generates a professional PDF report from filtered mappings
 */
export function generatePDFReport(
  mappings: Mapping[],
  options: PDFOptions = {}
): void {
  const {
    title = "NCSC CAF 4.0 to ISA 62443 Compliance Mapping Report",
    includeMetadata = true,
    includeTableOfContents = true,
  } = options;

  // Create PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let pageNumber = 1;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Set fonts
  const titleFont = 24;
  const headingFont = 14;
  const subHeadingFont = 12;
  const bodyFont = 10;

  // Helper function to add new page
  const addNewPage = () => {
    doc.addPage();
    pageNumber += 1;
    yPosition = margin;
    addFooter();
  };

  // Helper function to add footer with page number
  const addFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${pageNumber}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      margin,
      pageHeight - 10
    );
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      addNewPage();
    }
  };

  // Helper function to wrap text
  const getWrappedText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth) as string[];
  };

  // Title Page
  doc.setFontSize(titleFont);
  doc.setTextColor(0, 0, 0);
  doc.text(title, margin, yPosition);
  yPosition += 15;

  doc.setFontSize(subHeadingFont);
  doc.setTextColor(100, 100, 100);
  doc.text("Searchable Reference for Cyber Security Compliance in HVDC Systems", margin, yPosition);
  yPosition += 20;

  if (includeMetadata) {
    doc.setFontSize(bodyFont);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Mappings: ${mappings.length}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
    yPosition += 7;

    // Group by objective for summary
    const objectiveCounts: Record<string, number> = {};
    mappings.forEach((m) => {
      objectiveCounts[m.objective] = (objectiveCounts[m.objective] || 0) + 1;
    });

    doc.text("Objectives Included:", margin, yPosition);
    yPosition += 7;
    Object.entries(objectiveCounts).forEach(([obj, count]) => {
      doc.text(`  ${obj}: ${count} mappings`, margin + 5, yPosition);
      yPosition += 6;
    });
  }

  yPosition += 10;

  // Table of Contents (if requested)
  if (includeTableOfContents && mappings.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(headingFont);
    doc.setTextColor(0, 0, 0);
    doc.text("Table of Contents", margin, yPosition);
    yPosition += 12;

    doc.setFontSize(bodyFont);
    const objectivesSet = new Set(mappings.map((m) => m.objective));
    const objectives = Array.from(objectivesSet);
    objectives.forEach((obj, index) => {
      const count = mappings.filter((m) => m.objective === obj).length;
      doc.text(`${obj}: ${count} controls`, margin + 5, yPosition);
      yPosition += 6;
    });

    yPosition += 10;
  }

  // Detailed Mappings Section
  checkPageBreak(30);
  doc.setFontSize(headingFont);
  doc.setTextColor(0, 0, 0);
  doc.text("Detailed Compliance Mappings", margin, yPosition);
  yPosition += 12;

  // Group mappings by objective
  const groupedMappings: Record<string, Mapping[]> = {};
  mappings.forEach((m) => {
    if (!groupedMappings[m.objective]) {
      groupedMappings[m.objective] = [];
    }
    groupedMappings[m.objective].push(m);
  });

  // Render each objective section
  const objectiveEntries = Object.entries(groupedMappings);
  objectiveEntries.forEach(([objective, objectiveMappings]) => {
    checkPageBreak(20);
    doc.setFontSize(subHeadingFont);
    doc.setTextColor(25, 118, 210); // Blue color for objective
    doc.text(`${objective}`, margin, yPosition);
    yPosition += 10;

    // Render each mapping in this objective
    objectiveMappings.forEach((mapping, index) => {
      checkPageBreak(50);

      // Mapping header
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`${mapping.principle}: ${mapping.itemName}`, margin, yPosition);
      yPosition += 7;

      // Description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(bodyFont);
      doc.setTextColor(60, 60, 60);
      const descLines = getWrappedText(mapping.description, contentWidth);
      descLines.forEach((line) => {
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 2;

      // CAF Principle Description
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("CAF Principle Description:", margin, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const cafLines = getWrappedText(mapping.cafDescription, contentWidth);
      cafLines.forEach((line) => {
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 2;

      // ISA 62443-3-3
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("ISA 62443-3-3 (System Requirements):", margin, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const isa3_3Lines = getWrappedText(mapping.isa62443_3_3, contentWidth);
      isa3_3Lines.forEach((line) => {
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 2;

      // ISA 62443-4-2
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("ISA 62443-4-2 (Component Requirements):", margin, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const isa4_2Lines = getWrappedText(mapping.isa62443_4_2, contentWidth);
      isa4_2Lines.forEach((line) => {
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 2;

      // Device Types
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Device Types:", margin, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(mapping.deviceTypes.join(", "), margin, yPosition);
      yPosition += 5;

      // Keywords
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Keywords:", margin, yPosition);
      yPosition += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const keywordLines = getWrappedText(mapping.keywords.join(", "), contentWidth);
      keywordLines.forEach((line) => {
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });

      yPosition += 8; // Space between mappings
    });
  });

  // Add footer to last page
  addFooter();

  // Save the PDF
  const filename = `caf_isa_compliance_report_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}

/**
 * Generates a summary PDF report with statistics and overview
 */
export function generateSummaryPDFReport(mappings: Mapping[]): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text("NCSC CAF 4.0 to ISA 62443 Compliance Summary", margin, yPosition);
  yPosition += 20;

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += 10;

  // Summary Statistics
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Summary Statistics", margin, yPosition);
  yPosition += 12;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  // Total mappings
  doc.text(`Total Compliance Mappings: ${mappings.length}`, margin, yPosition);
  yPosition += 8;

  // By objective
  const objectiveCounts: Record<string, number> = {};
  mappings.forEach((m) => {
    objectiveCounts[m.objective] = (objectiveCounts[m.objective] || 0) + 1;
  });

  doc.setFont("helvetica", "bold");
  doc.text("Breakdown by Objective:", margin, yPosition);
  yPosition += 8;

  doc.setFont("helvetica", "normal");
  Object.entries(objectiveCounts).forEach(([obj, count]) => {
    const percentage = ((count / mappings.length) * 100).toFixed(1);
    doc.text(`  ${obj}: ${count} (${percentage}%)`, margin + 5, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // By device type
  const deviceTypeCounts: Record<string, number> = {};
  mappings.forEach((m) => {
    m.deviceTypes.forEach((dt) => {
      deviceTypeCounts[dt] = (deviceTypeCounts[dt] || 0) + 1;
    });
  });

  doc.setFont("helvetica", "bold");
  doc.text("Breakdown by Device Type:", margin, yPosition);
  yPosition += 8;

  doc.setFont("helvetica", "normal");
  Object.entries(deviceTypeCounts).forEach(([dt, count]) => {
    const percentage = ((count / mappings.length) * 100).toFixed(1);
    doc.text(`  ${dt}: ${count} (${percentage}%)`, margin + 5, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Principles overview
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Principles Overview", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const principlesSet = new Set(mappings.map((m) => m.principle));
  const principles = Array.from(principlesSet);
  principles.forEach((principle) => {
    const principleCount = mappings.filter((m) => m.principle === principle).length;
    doc.text(`${principle}: ${principleCount} controls`, margin + 5, yPosition);
    yPosition += 6;

    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Page 1`,
    pageWidth - margin - 20,
    pageHeight - 10
  );
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    margin,
    pageHeight - 10
  );

  const filename = `caf_isa_summary_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}

/**
 * Generates a timestamped filename for the PDF export
 */
export function generatePDFFilename(type: "detailed" | "summary" = "detailed"): string {
  const now = new Date();
  const timestamp = now.toISOString().split("T")[0]; // YYYY-MM-DD format
  return type === "summary"
    ? `caf_isa_summary_${timestamp}.pdf`
    : `caf_isa_compliance_report_${timestamp}.pdf`;
}
