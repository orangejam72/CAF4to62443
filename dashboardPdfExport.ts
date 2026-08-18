import jsPDF from "jspdf";

interface DashboardMetrics {
  compliancePercentage: number;
  implemented: number;
  inProgress: number;
  notStarted: number;
  total: number;
  totalSystems: number;
  activeAssessments: number;
  coverage: string;
}

export async function exportDashboardPDF(
  dashboardElement: HTMLElement,
  metrics: DashboardMetrics
): Promise<void> {
  try {
    // Create PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Add header
    pdf.setFontSize(24);
    pdf.setTextColor(15, 23, 42); // slate-900
    pdf.text("Compliance Dashboard Report", margin, yPosition);
    yPosition += 12;

    // Add timestamp
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139); // slate-600
    const timestamp = new Date().toLocaleString();
    pdf.text(`Generated: ${timestamp}`, margin, yPosition);
    yPosition += 8;

    // Add divider line
    pdf.setDrawColor(226, 232, 240); // slate-200
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Add executive summary
    pdf.setFontSize(14);
    pdf.setTextColor(15, 23, 42);
    pdf.text("Executive Summary", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(51, 65, 85); // slate-700
    const summaryText = `Your organization has achieved ${metrics.compliancePercentage}% compliance with NCSC CAF 4.0 and ISA 62443 standards. Of the ${metrics.total} required controls, ${metrics.implemented} have been implemented, ${metrics.inProgress} are in progress, and ${metrics.notStarted} have not yet been started.`;
    const wrappedSummary = pdf.splitTextToSize(
      summaryText,
      pageWidth - 2 * margin
    );
    pdf.text(wrappedSummary, margin, yPosition);
    yPosition += wrappedSummary.length * 5 + 5;

    // Add divider
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Add metrics section
    pdf.setFontSize(14);
    pdf.setTextColor(15, 23, 42);
    pdf.text("Key Metrics", margin, yPosition);
    yPosition += 8;

    // Metrics table
    const metricsData = [
      ["Metric", "Value"],
      ["Overall Compliance", `${metrics.compliancePercentage}%`],
      ["Implemented Controls", `${metrics.implemented}/${metrics.total}`],
      ["In Progress", `${metrics.inProgress}`],
      ["Not Started", `${metrics.notStarted}`],
      ["Total Systems", `${metrics.totalSystems}`],
      ["Active Assessments", `${metrics.activeAssessments}`],
      ["Coverage", metrics.coverage],
    ];

    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);

    const cellWidth = (pageWidth - 2 * margin) / 2;
    const cellHeight = 7;

    // Header row
    pdf.setFillColor(59, 130, 246); // blue-500
    pdf.setTextColor(255, 255, 255);
    metricsData[0]?.forEach((text, index) => {
      pdf.rect(
        margin + index * cellWidth,
        yPosition,
        cellWidth,
        cellHeight,
        "F"
      );
      pdf.text(text, margin + index * cellWidth + 2, yPosition + 5);
    });
    yPosition += cellHeight;

    // Data rows
    pdf.setTextColor(15, 23, 42);
    metricsData.slice(1).forEach((row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(248, 250, 252); // slate-50
      } else {
        pdf.setFillColor(255, 255, 255);
      }

      row.forEach((text, colIndex) => {
        pdf.rect(
          margin + colIndex * cellWidth,
          yPosition,
          cellWidth,
          cellHeight,
          "F"
        );
        pdf.text(text, margin + colIndex * cellWidth + 2, yPosition + 5);
      });
      yPosition += cellHeight;
    });

    yPosition += 5;

    // Add divider
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Add compliance breakdown section
    pdf.setFontSize(14);
    pdf.setTextColor(15, 23, 42);
    pdf.text("Compliance Breakdown", margin, yPosition);
    yPosition += 8;

    // Objective breakdown
    pdf.setFontSize(11);
    pdf.setTextColor(51, 65, 85);
    pdf.text("Control Status by Objective:", margin, yPosition);
    yPosition += 6;

    const objectiveBreakdown = [
      ["Objective A: Managing Security Risk", "5 Implemented, 2 In Progress, 1 Not Started"],
      ["Objective B: Protecting Against Attack", "4 Implemented, 2 In Progress, 2 Not Started"],
      ["Objective C: Detecting Cyber Events", "3 Implemented, 1 In Progress, 2 Not Started"],
      ["Objective D: Minimising Impact", "3 Implemented, 0 In Progress, 1 Not Started"],
    ];

    pdf.setFontSize(9);
    objectiveBreakdown.forEach((item) => {
      if (yPosition > pageHeight - margin - 10) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.setTextColor(51, 65, 85);
      pdf.text(`• ${item[0]}`, margin + 5, yPosition);
      yPosition += 5;
      pdf.setTextColor(100, 116, 139);
      pdf.text(`  ${item[1]}`, margin + 10, yPosition);
      yPosition += 5;
    });

    yPosition += 5;

    // Add device type section
    if (yPosition > pageHeight - margin - 20) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(15, 23, 42);
    pdf.text("System Inventory", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(51, 65, 85);
    const inventoryText = `Total Systems: ${metrics.totalSystems}
Device Types: Embedded, Network, Host
Coverage: ${metrics.coverage}`;
    const wrappedInventory = pdf.splitTextToSize(
      inventoryText,
      pageWidth - 2 * margin
    );
    pdf.text(wrappedInventory, margin, yPosition);
    yPosition += wrappedInventory.length * 5 + 5;

    // Add recommendations section
    if (yPosition > pageHeight - margin - 30) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(15, 23, 42);
    pdf.text("Recommendations", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(51, 65, 85);

    const recommendations = [
      `Priority 1: Complete ${metrics.notStarted} controls that have not been started`,
      `Priority 2: Move ${metrics.inProgress} in-progress controls to implementation`,
      "Priority 3: Conduct regular compliance audits to maintain current status",
      "Priority 4: Document all implemented controls with evidence of compliance",
      "Priority 5: Establish a continuous monitoring program for all systems",
    ];

    recommendations.forEach((rec, index) => {
      if (yPosition > pageHeight - margin - 10) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(`${index + 1}. ${rec}`, margin + 5, yPosition);
      yPosition += 6;
    });

    // Add footer on all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text(
        "NCSC CAF 4.0 to ISA 62443 Compliance Mapping Reference",
        margin,
        pageHeight - 10
      );
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin - 30,
        pageHeight - 10
      );
    }

    // Save the PDF
    const filename = `compliance_dashboard_${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating dashboard PDF:", error);
    throw new Error("Failed to generate dashboard PDF");
  }
}

export function generateDashboardFilename(): string {
  const date = new Date().toISOString().split("T")[0];
  return `compliance_dashboard_${date}.pdf`;
}
