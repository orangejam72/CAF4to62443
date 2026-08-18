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

/**
 * Escapes CSV field values to handle commas, quotes, and newlines
 */
function escapeCSVField(field: string | string[]): string {
  let value = Array.isArray(field) ? field.join("; ") : field;
  
  // Escape quotes by doubling them
  value = value.replace(/"/g, '""');
  
  // Wrap in quotes if contains comma, newline, or quote
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    value = `"${value}"`;
  }
  
  return value;
}

/**
 * Converts filtered mappings to CSV format
 */
function mappingsToCSV(mappings: Mapping[]): string {
  // Define headers matching Eramba import format
  const headers = [
    "Status",
    "Chapter ID",
    "Chapter Name",
    "Chapter Description",
    "Item ID",
    "Item Name",
    "Item Description",
    "Item Additional Information",
    "Device Types",
    "Keywords"
  ];

  // Create header row
  const headerRow = headers.map(escapeCSVField).join(",");

  // Create data rows
  const dataRows = mappings.map((mapping) => {
    const row = [
      "OK", // Status
      mapping.principle, // Chapter ID
      mapping.principleName, // Chapter Name
      mapping.cafDescription, // Chapter Description
      mapping.id, // Item ID
      mapping.itemName, // Item Name
      mapping.description, // Item Description
      `ISA 62443-3-3: ${mapping.isa62443_3_3}\nISA 62443-4-2: ${mapping.isa62443_4_2}`, // Item Additional Information
      mapping.deviceTypes.join("; "), // Device Types
      mapping.keywords.join("; ") // Keywords
    ];
    return row.map(escapeCSVField).join(",");
  });

  // Combine header and data rows
  return [headerRow, ...dataRows].join("\n");
}

/**
 * Triggers CSV download in the browser
 */
export function downloadCSV(mappings: Mapping[], filename: string = "caf_isa_mapping.csv"): void {
  const csv = mappingsToCSV(mappings);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Generates a timestamped filename for the export
 */
export function generateFilename(): string {
  const now = new Date();
  const timestamp = now.toISOString().split("T")[0]; // YYYY-MM-DD format
  return `caf_isa_mapping_${timestamp}.csv`;
}
