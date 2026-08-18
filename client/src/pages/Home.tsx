import { useState, useMemo } from "react";
import { Search, Filter, X, Download, FileText, BarChart3, Package, BarChart } from "lucide-react";
import { useLocation } from "wouter";
import { downloadCSV, generateFilename } from "@/lib/csvExport";
import { generatePDFReport, generateSummaryPDFReport } from "@/lib/pdfExport";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { flatMappings, type FlatMapping } from "@/data";

const mappingsData = { mappings: flatMappings };

type Mapping = FlatMapping;

export default function Home() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mappings: Mapping[] = mappingsData.mappings;

  // Extract unique objectives and device types
  const objectives = useMemo(() => {
    const unique = new Map<string, string>();
    mappings.forEach((m) => {
      if (!unique.has(m.objective)) {
        unique.set(m.objective, m.objectiveName);
      }
    });
    return Array.from(unique.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const deviceTypes = useMemo(() => {
    const unique = new Set<string>();
    mappings.forEach((m) => {
      m.deviceTypes.forEach((dt) => unique.add(dt));
    });
    // "All" is already rendered as the reset button, so don't list it again.
    unique.delete("All");
    return Array.from(unique).sort();
  }, []);

  // Filter mappings based on search and filters
  const filteredMappings = useMemo(() => {
    return mappings.filter((mapping) => {
      const matchesSearch =
        searchQuery === "" ||
        mapping.principle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mapping.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mapping.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mapping.isa62443_3_3.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mapping.isa62443_4_2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mapping.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesObjective = selectedObjective === null || mapping.objective === selectedObjective;
      const matchesDeviceType =
        selectedDeviceType === null ||
        mapping.deviceTypes.includes(selectedDeviceType) ||
        mapping.deviceTypes.includes("All");

      return matchesSearch && matchesObjective && matchesDeviceType;
    });
  }, [searchQuery, selectedObjective, selectedDeviceType]);

  const getObjectiveColor = (objective: string) => {
    const colors: Record<string, string> = {
      A: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      B: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      C: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      D: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return colors[objective] || "bg-gray-100 text-gray-800";
  };

  const getDeviceTypeColor = (deviceType: string) => {
    const colors: Record<string, string> = {
      Embedded: "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200",
      Network: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200",
      Host: "bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
      All: "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
    };
    return colors[deviceType] || "bg-gray-50 text-gray-700";
  };

  const handleExportCSV = () => {
    downloadCSV(filteredMappings, generateFilename());
  };

  const handleExportPDF = () => {
    generatePDFReport(filteredMappings, {
      title: "NCSC CAF 4.0 to ISA 62443 Compliance Mapping Report",
      includeMetadata: true,
      includeTableOfContents: true,
    });
  };

  const handleExportSummaryPDF = () => {
    generateSummaryPDFReport(filteredMappings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-40">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              NCSC CAF 4.0 to ISA 62443 Mapping
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Searchable reference for cyber security compliance in HVDC systems
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by principle, control, or ISA requirement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

              {/* Navigation and Export Buttons */}
          <div className="flex justify-between gap-2 mb-4">
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="gap-2"
              >
                <BarChart className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                onClick={() => navigate("/inventory")}
                variant="outline"
                className="gap-2"
              >
                <Package className="h-4 w-4" />
                Inventory
              </Button>
              <Button
                onClick={() => navigate("/gap-analysis")}
                variant="default"
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Gap Analysis
              </Button>
            </div>
            <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              className="gap-2"
              disabled={filteredMappings.length === 0}
            >
              <Download className="h-4 w-4" />
              CSV ({filteredMappings.length})
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="gap-2"
              disabled={filteredMappings.length === 0}
            >
              <FileText className="h-4 w-4" />
              PDF Report
            </Button>
            <Button
              onClick={handleExportSummaryPDF}
              variant="outline"
              className="gap-2"
              disabled={filteredMappings.length === 0}
            >
              <FileText className="h-4 w-4" />
              Summary
            </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Objective:</span>
            </div>
            <Button
              variant={selectedObjective === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedObjective(null)}
              className="rounded-full"
            >
              All
            </Button>
            {objectives.map(([obj, name]) => (
              <Button
                key={obj}
                variant={selectedObjective === obj ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedObjective(obj)}
                className={`rounded-full ${selectedObjective === obj ? getObjectiveColor(obj) : ""}`}
              >
                {obj}: {name}
              </Button>
            ))}
          </div>

          {/* Device Type Filters */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Device Type:</span>
            </div>
            <Button
              variant={selectedDeviceType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDeviceType(null)}
              className="rounded-full"
            >
              All
            </Button>
            {deviceTypes.map((dt) => (
              <Button
                key={dt}
                variant={selectedDeviceType === dt ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDeviceType(dt)}
                className="rounded-full"
              >
                {dt}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredMappings.length} of {mappings.length} mappings
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={filteredMappings.length === 0}
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={filteredMappings.length === 0}
            >
              <FileText className="h-4 w-4" />
              PDF Report
            </Button>
            <Button
              onClick={handleExportSummaryPDF}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={filteredMappings.length === 0}
            >
              <FileText className="h-4 w-4" />
              Summary
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredMappings.length > 0 ? (
            filteredMappings.map((mapping) => (
              <Card
                key={mapping.id}
                className="cursor-pointer transition-all hover:shadow-lg dark:hover:shadow-slate-800"
                onClick={() => setExpandedId(expandedId === mapping.id ? null : mapping.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={getObjectiveColor(mapping.objective)}>
                          {mapping.principle}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {mapping.id}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {mapping.principleName}
                        </span>
                        {mapping.newIn40 && (
                          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs">
                            New in 4.0
                          </Badge>
                        )}
                        {!mapping.verified && (
                          <Badge
                            className="bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs"
                            title="This outcome's CAF 4.0 definition has not been confirmed against the NCSC source."
                          >
                            Unverified
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{mapping.itemName}</CardTitle>
                      <CardDescription className="mt-2">{mapping.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {expandedId === mapping.id && (
                  <CardContent className="pt-0 border-t border-slate-200 dark:border-slate-800">
                    <div className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          CAF Principle Description
                        </h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{mapping.cafDescription}</p>
                      </div>

                      {mapping.rationale && (
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Why these map
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {mapping.rationale}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                            Provenance: {mapping.provenance} — drafted mappings are a starting point
                            for expert review, not a finished compliance artifact.
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          IEC 62443 — System &amp; programme level (2-1, 2-4, 3-2, 3-3, 4-1)
                        </h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded whitespace-pre-wrap break-words">
                          {mapping.isa62443_3_3}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                          IEC 62443-4-2 — Component level (CR / EDR / HDR / NDR)
                        </h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded whitespace-pre-wrap break-words">
                          {mapping.isa62443_4_2}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Device Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {mapping.deviceTypes.map((dt) => (
                            <Badge key={dt} variant="secondary" className={getDeviceTypeColor(dt)}>
                              {dt}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {mapping.keywords.map((kw) => (
                            <Badge key={kw} variant="outline" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  No mappings found. Try adjusting your search or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
