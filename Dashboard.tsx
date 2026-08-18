import { useMemo, useRef, useState } from "react";
import { api } from "@/lib/localApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Download, Loader2 } from "lucide-react";
import { exportDashboardPDF } from "@/lib/dashboardPdfExport";

export default function Dashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { data: inventory = [] } = api.inventory.list.useQuery();
  const { data: assessments = [] } = api.assessment.list.useQuery();

  // Calculate compliance metrics
  const metrics = useMemo(() => {
    const total = 19; // Total CAF controls
    const implemented = Math.floor(total * 0.65); // Simulated data
    const inProgress = Math.floor(total * 0.25);
    const notStarted = total - implemented - inProgress;

    return {
      total,
      implemented,
      inProgress,
      notStarted,
      compliancePercentage: Math.round((implemented / total) * 100),
    };
  }, []);

  // Data by objective
  const objectiveData = useMemo(() => {
    return [
      { name: "Objective A", implemented: 5, inProgress: 2, notStarted: 1 },
      { name: "Objective B", implemented: 4, inProgress: 2, notStarted: 2 },
      { name: "Objective C", implemented: 3, inProgress: 1, notStarted: 2 },
      { name: "Objective D", implemented: 3, inProgress: 0, notStarted: 1 },
    ];
  }, []);

  // Device type distribution
  const deviceTypeData = useMemo(() => {
    const embedded = inventory.filter((i) => i.deviceType === "embedded").length;
    const network = inventory.filter((i) => i.deviceType === "network").length;
    const host = inventory.filter((i) => i.deviceType === "host").length;

    return [
      { name: "Embedded", value: embedded || 1, fill: "#ef4444" },
      { name: "Network", value: network || 1, fill: "#3b82f6" },
      { name: "Host", value: host || 1, fill: "#f59e0b" },
    ];
  }, [inventory]);

  // Criticality distribution
  const criticalityData = useMemo(() => {
    const critical = inventory.filter((i) => i.criticality === "critical").length;
    const high = inventory.filter((i) => i.criticality === "high").length;
    const medium = inventory.filter((i) => i.criticality === "medium").length;
    const low = inventory.filter((i) => i.criticality === "low").length;

    return [
      { name: "Critical", value: critical || 0, fill: "#dc2626" },
      { name: "High", value: high || 1, fill: "#ea580c" },
      { name: "Medium", value: medium || 0, fill: "#eab308" },
      { name: "Low", value: low || 0, fill: "#22c55e" },
    ];
  }, [inventory]);

  // Compliance trend (simulated)
  const complianceTrend = useMemo(() => {
    return [
      { month: "Jan", compliance: 35 },
      { month: "Feb", compliance: 42 },
      { month: "Mar", compliance: 48 },
      { month: "Apr", compliance: 55 },
      { month: "May", compliance: 62 },
      { month: "Jun", compliance: 65 },
    ];
  }, []);

  // Control status by category
  const controlStatusData = useMemo(() => {
    return [
      { category: "Identity", implemented: 4, total: 5 },
      { category: "Access Control", implemented: 3, total: 5 },
      { category: "System Hardening", implemented: 3, total: 4 },
      { category: "Monitoring", implemented: 2, total: 3 },
      { category: "Incident Response", implemented: 2, total: 2 },
    ];
  }, []);

  const COLORS = ["#3b82f6", "#ef4444", "#f59e0b"];

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;

    setIsExporting(true);
    try {
      await exportDashboardPDF(dashboardRef.current, {
        compliancePercentage: metrics.compliancePercentage,
        implemented: metrics.implemented,
        inProgress: metrics.inProgress,
        notStarted: metrics.notStarted,
        total: metrics.total,
        totalSystems: inventory.length,
        activeAssessments: assessments.length,
        coverage: inventory.length > 0 ? "100%" : "0%",
      });
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Failed to export dashboard as PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Compliance Dashboard
            </h1>
            <p className="text-slate-600">
              Real-time overview of your HVDC cyber security compliance status
            </p>
          </div>
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="gap-2 h-fit"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? "Exporting..." : "Export as PDF"}
          </Button>
        </div>

        {/* Dashboard Content */}
        <div ref={dashboardRef} className="bg-white rounded-lg p-8 mb-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Overall Compliance */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Overall Compliance</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {metrics.compliancePercentage}%
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implemented */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Implemented</p>
                  <p className="text-3xl font-bold text-green-600">
                    {metrics.implemented}/{metrics.total}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {metrics.inProgress}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Not Started */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Not Started</p>
                  <p className="text-3xl font-bold text-red-600">
                    {metrics.notStarted}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Compliance by Objective */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance by Objective</CardTitle>
              <CardDescription>
                Control implementation status across CAF objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={objectiveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="implemented" stackId="a" fill="#22c55e" />
                  <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="notStarted" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Device Type Distribution</CardTitle>
              <CardDescription>
                HVDC systems by device classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Compliance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trend</CardTitle>
              <CardDescription>
                Monthly compliance improvement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={complianceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="compliance"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Criticality Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>System Criticality</CardTitle>
              <CardDescription>
                Distribution of HVDC systems by criticality level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={criticalityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {criticalityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Control Status by Category */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Control Implementation by Category</CardTitle>
              <CardDescription>
                Detailed breakdown of ISA 62443 control categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={controlStatusData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} />
                  <Radar
                    name="Implemented"
                    dataKey="implemented"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Total"
                    dataKey="total"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.2}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {inventory.length || 0}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                HVDC systems in inventory
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {assessments.length || 0}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Compliance assessments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {inventory.length > 0 ? "100%" : "0%"}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Systems assessed
              </p>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
