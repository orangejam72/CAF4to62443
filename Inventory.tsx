import { useState } from "react";
import { api } from "@/lib/localApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Inventory() {
  const [, navigate] = useLocation();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    systemName: "",
    systemType: "",
    deviceType: "embedded" as "embedded" | "network" | "host",
    manufacturer: "",
    model: "",
    firmwareVersion: "",
    location: "",
    criticality: "high" as "critical" | "high" | "medium" | "low",
    notes: "",
  });

  const { data: inventory = [], refetch } = api.inventory.list.useQuery();
  const createMutation = api.inventory.create.useMutation();
  const deleteMutation = api.inventory.delete.useMutation();

  const handleAddSystem = async () => {
    if (!formData.systemName.trim() || !formData.systemType.trim()) {
      toast.error("Please fill in system name and type");
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast.success("System added successfully");
      setFormData({
        systemName: "",
        systemType: "",
        deviceType: "embedded",
        manufacturer: "",
        model: "",
        firmwareVersion: "",
        location: "",
        criticality: "high",
        notes: "",
      });
      setIsAddingNew(false);
      refetch();
    } catch (error) {
      toast.error("Failed to add system");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this system?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("System deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete system");
      console.error(error);
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            HVDC System Inventory
          </h1>
          <p className="text-slate-600">
            Manage your HVDC systems and devices for compliance assessment
          </p>
        </div>

        {/* Add New System Form */}
        {isAddingNew && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New System</CardTitle>
              <CardDescription>Enter details for your HVDC system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    System Name *
                  </label>
                  <Input
                    placeholder="e.g., HVDC Terminal Station A"
                    value={formData.systemName}
                    onChange={(e) =>
                      setFormData({ ...formData, systemName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    System Type *
                  </label>
                  <Input
                    placeholder="e.g., Converter Station, Transmission Line"
                    value={formData.systemType}
                    onChange={(e) =>
                      setFormData({ ...formData, systemType: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Device Type
                  </label>
                  <Select value={formData.deviceType} onValueChange={(value) =>
                    setFormData({ ...formData, deviceType: value as any })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="embedded">Embedded</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Criticality
                  </label>
                  <Select value={formData.criticality} onValueChange={(value) =>
                    setFormData({ ...formData, criticality: value as any })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Manufacturer
                  </label>
                  <Input
                    placeholder="e.g., Siemens, ABB"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Model
                  </label>
                  <Input
                    placeholder="e.g., HVDC Plus"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Firmware Version
                  </label>
                  <Input
                    placeholder="e.g., 5.2.1"
                    value={formData.firmwareVersion}
                    onChange={(e) =>
                      setFormData({ ...formData, firmwareVersion: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <Input
                    placeholder="e.g., North Region, Site 1"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes
                  </label>
                  <Input
                    placeholder="Additional information..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSystem}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Adding..." : "Add System"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Button */}
        {!isAddingNew && (
          <div className="mb-8">
            <Button onClick={() => setIsAddingNew(true)} size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Add New System
            </Button>
          </div>
        )}

        {/* Inventory List */}
        <div className="grid gap-4">
          {inventory.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600 mb-4">
                  No systems in inventory yet. Add your first HVDC system to get started.
                </p>
                <Button onClick={() => setIsAddingNew(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add System
                </Button>
              </CardContent>
            </Card>
          ) : (
            inventory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {item.systemName}
                      </h3>
                      <p className="text-slate-600">{item.systemType}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/gap-analysis`)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Device Type</p>
                      <Badge className={getDeviceTypeColor(item.deviceType)}>
                        {item.deviceType}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Criticality</p>
                      <Badge className={getCriticalityColor(item.criticality || "")}>
                        {item.criticality}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Manufacturer</p>
                      <p className="text-sm font-medium">{item.manufacturer || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Model</p>
                      <p className="text-sm font-medium">{item.model || "—"}</p>
                    </div>
                  </div>

                  {item.location && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Location:</span> {item.location}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-sm text-slate-600 mt-2">
                      <span className="font-medium">Notes:</span> {item.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
