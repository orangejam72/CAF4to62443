import { useState } from "react";
import { api } from "@/lib/localApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, BarChart3, Download } from "lucide-react";
import { toast } from "sonner";

export default function GapAnalysis() {
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<number[]>([]);
  const [assessmentName, setAssessmentName] = useState("");
  const [assessmentDescription, setAssessmentDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: inventory = [] } = api.inventory.list.useQuery();
  const { data: assessments = [] } = api.assessment.list.useQuery();
  const analyzeMutation = api.assessment.analyze.useMutation();

  const handleSelectInventory = (id: number) => {
    setSelectedInventoryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAnalyze = async () => {
    if (selectedInventoryIds.length === 0) {
      toast.error("Please select at least one inventory item");
      return;
    }

    if (!assessmentName.trim()) {
      toast.error("Please enter an assessment name");
      return;
    }

    setIsAnalyzing(true);
    try {
      await analyzeMutation.mutateAsync({
        inventoryIds: selectedInventoryIds,
        assessmentName,
        description: assessmentDescription,
      });

      toast.success("Gap analysis completed successfully");
      setSelectedInventoryIds([]);
      setAssessmentName("");
      setAssessmentDescription("");
    } catch (error) {
      toast.error("Failed to perform gap analysis");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDeviceTypeColor = (deviceType: string) => {
    const colors: Record<string, string> = {
      embedded: "bg-red-100 text-red-800",
      network: "bg-blue-100 text-blue-800",
      host: "bg-amber-100 text-amber-800",
    };
    return colors[deviceType] || "bg-gray-100 text-gray-800";
  };

  const getCriticalityColor = (criticality: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[criticality] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Compliance Gap Analysis
          </h1>
          <p className="text-slate-600">
            Analyze your HVDC system inventory against NCSC CAF 4.0 and ISA 62443 requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Assessment Setup */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Create New Assessment</CardTitle>
                <CardDescription>Select inventory items and run gap analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Assessment Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Assessment Name
                    </label>
                    <Input
                      placeholder="e.g., HVDC Terminal Station Q1 2026"
                      value={assessmentName}
                      onChange={(e) => setAssessmentName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description (Optional)
                    </label>
                    <Input
                      placeholder="Additional context for this assessment"
                      value={assessmentDescription}
                      onChange={(e) => setAssessmentDescription(e.target.value)}
                    />
                  </div>
                </div>

                {/* Inventory Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Select Systems to Analyze ({selectedInventoryIds.length} selected)
                  </label>

                  {inventory.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                      <p className="text-slate-600 mb-4">No inventory items found</p>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Inventory Item
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {inventory.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <Checkbox
                            checked={selectedInventoryIds.includes(item.id)}
                            onCheckedChange={() => handleSelectInventory(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900">{item.systemName}</p>
                            <p className="text-sm text-slate-600">{item.systemType}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Badge className={getDeviceTypeColor(item.deviceType)}>
                                {item.deviceType}
                              </Badge>
                              {item.criticality && (
                                <Badge className={getCriticalityColor(item.criticality)}>
                                  {item.criticality}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={selectedInventoryIds.length === 0 || !assessmentName || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Run Gap Analysis"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Assessments */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
                <CardDescription>{assessments.length} total</CardDescription>
              </CardHeader>
              <CardContent>
                {assessments.length === 0 ? (
                  <p className="text-sm text-slate-600 text-center py-8">
                    No assessments yet. Create one to get started.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {assessments.slice(0, 5).map((assessment) => (
                      <div
                        key={assessment.id}
                        className="p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <p className="font-medium text-slate-900 text-sm">
                          {assessment.assessmentName}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Compliance: {assessment.compliancePercentage}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {assessment.implementedControls}/{assessment.totalControls}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
