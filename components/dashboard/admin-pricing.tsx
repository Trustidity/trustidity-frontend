"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Edit,
  Save,
  X,
  TrendingUp,
  Activity,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/lib/geolocation";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

interface PricingConfig {
  id: string;
  key: string;
  description: string;
  ngnPricing: {
    individual: number;
    employer: number;
    embassy: number;
    bulk_discount: number;
  };
  usdPricing: {
    individual: number;
    employer: number;
    embassy: number;
    bulk_discount: number;
  };
  isActive: boolean;
}

export function AdminPricing() {
  const [pricing, setPricing] = useState<PricingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PricingConfig>>({});
  const [saveLoading, setSaveLoading] = useState(false);

  const api = useApi();
  const { toast } = useToast();

  const fetchPricingSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getSystemSettings();

      if (response.success && response.data) {
        const pricingSettings = response.data.settings.pricing || [];

        // Transform backend settings to frontend format
        const transformedPricing: PricingConfig[] = [];

        // Find NGN and USD pricing settings
        const ngnSetting = pricingSettings.find(
          (s: any) => s.key === "verification_pricing_ngn"
        );
        const usdSetting = pricingSettings.find(
          (s: any) => s.key === "verification_pricing_usd"
        );

        if (ngnSetting && usdSetting) {
          transformedPricing.push({
            id: "verification_pricing",
            key: "verification_pricing",
            description: "Verification Service Pricing",
            ngnPricing: ngnSetting.value,
            usdPricing: usdSetting.value,
            isActive: ngnSetting.isActive && usdSetting.isActive,
          });
        }

        setPricing(transformedPricing);
      } else {
        setError(response.error || "Failed to fetch pricing settings");
        toast({
          title: "Error",
          description: response.error || "Failed to fetch pricing settings",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingSettings();
  }, []);

  const handleEdit = (config: PricingConfig) => {
    setEditingId(config.id);
    setEditForm(config);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;

    try {
      setSaveLoading(true);

      // Save NGN pricing
      const ngnResponse = await api.saveSystemSetting(
        "verification_pricing_ngn",
        editForm.ngnPricing,
        "pricing",
        "Verification pricing in Nigerian Naira"
      );

      if (!ngnResponse.success) {
        throw new Error(ngnResponse.error || "Failed to save NGN pricing");
      }

      // Save USD pricing
      const usdResponse = await api.saveSystemSetting(
        "verification_pricing_usd",
        editForm.usdPricing,
        "pricing",
        "Verification pricing in US Dollars"
      );

      if (!usdResponse.success) {
        throw new Error(usdResponse.error || "Failed to save USD pricing");
      }

      // Update local state
      setPricing((prev) =>
        prev.map((p) =>
          p.id === editingId ? ({ ...p, ...editForm } as PricingConfig) : p
        )
      );

      setEditingId(null);
      setEditForm({});

      toast({
        title: "Success",
        description: "Pricing settings updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to save pricing settings",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleToggleActive = async (id: string) => {
    const config = pricing.find((p) => p.id === id);
    if (!config) return;

    try {
      const newActiveState = !config.isActive;

      // Update both NGN and USD settings
      await api.saveSystemSetting(
        "verification_pricing_ngn",
        config.ngnPricing,
        "pricing",
        "Verification pricing in Nigerian Naira"
      );

      await api.saveSystemSetting(
        "verification_pricing_usd",
        config.usdPricing,
        "pricing",
        "Verification pricing in US Dollars"
      );

      setPricing((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: newActiveState } : p))
      );

      toast({
        title: "Success",
        description: `Pricing ${
          newActiveState ? "activated" : "deactivated"
        } successfully`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update pricing status",
        variant: "destructive",
      });
    }
  };

  const totalServices = pricing.length;
  const activeServices = pricing.filter((p) => p.isActive).length;

  // Calculate average prices
  const avgPriceNGN = pricing.length
    ? Math.round(
        pricing.reduce((sum, p) => sum + (p.ngnPricing?.individual || 0), 0) /
          pricing.length
      )
    : 0;

  const avgPriceUSD = pricing.length
    ? Math.round(
        pricing.reduce((sum, p) => sum + (p.usdPricing?.individual || 0), 0) /
          pricing.length
      )
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h3 className="text-lg font-medium">Failed to load pricing settings</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchPricingSettings}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Pricing Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure verification prices for different user types and
            currencies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchPricingSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Verification services
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Services
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeServices}
            </div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Price (NGN)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(avgPriceNGN, "NGN")}
            </div>
            <p className="text-xs text-muted-foreground">Nigerian users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Price (USD)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(avgPriceUSD, "USD")}
            </div>
            <p className="text-xs text-muted-foreground">International users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Configuration</CardTitle>
          <CardDescription>
            Manage pricing for all verification services. Changes take effect
            immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pricing.map((config) => (
              <div
                key={config.id}
                className="border rounded-lg p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {config.description}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Multi-tier pricing structure
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={config.isActive ? "default" : "secondary"}>
                      {config.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {editingId === config.id ? (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={saveLoading}
                        >
                          {saveLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={saveLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(config)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {editingId === config.id ? (
                  <div className="space-y-6">
                    {/* NGN Pricing */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">
                        Nigerian Naira (NGN) Pricing
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`ngn-individual-${config.id}`}>
                            Individual (NGN)
                          </Label>
                          <Input
                            id={`ngn-individual-${config.id}`}
                            type="number"
                            value={editForm.ngnPricing?.individual || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                ngnPricing: {
                                  ...prev.ngnPricing!,
                                  individual:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="Enter price in Naira"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`ngn-employer-${config.id}`}>
                            Employer (NGN)
                          </Label>
                          <Input
                            id={`ngn-employer-${config.id}`}
                            type="number"
                            value={editForm.ngnPricing?.employer || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                ngnPricing: {
                                  ...prev.ngnPricing!,
                                  employer:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="Enter price in Naira"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`ngn-embassy-${config.id}`}>
                            Embassy (NGN)
                          </Label>
                          <Input
                            id={`ngn-embassy-${config.id}`}
                            type="number"
                            value={editForm.ngnPricing?.embassy || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                ngnPricing: {
                                  ...prev.ngnPricing!,
                                  embassy: Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="Enter price in Naira"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* USD Pricing */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">
                        US Dollar (USD) Pricing
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`usd-individual-${config.id}`}>
                            Individual (USD)
                          </Label>
                          <Input
                            id={`usd-individual-${config.id}`}
                            type="number"
                            value={editForm.usdPricing?.individual || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                usdPricing: {
                                  ...prev.usdPricing!,
                                  individual:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="Enter price in Dollars"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`usd-employer-${config.id}`}>
                            Employer (USD)
                          </Label>
                          <Input
                            id={`usd-employer-${config.id}`}
                            type="number"
                            value={editForm.usdPricing?.employer || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                usdPricing: {
                                  ...prev.usdPricing!,
                                  employer:
                                    Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="Enter price in Dollars"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`usd-embassy-${config.id}`}>
                            Embassy (USD)
                          </Label>
                          <Input
                            id={`usd-embassy-${config.id}`}
                            type="number"
                            value={editForm.usdPricing?.embassy || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                usdPricing: {
                                  ...prev.usdPricing!,
                                  embassy: Number.parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                            placeholder="Enter price in Dollars"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editForm.isActive || false}
                        onCheckedChange={(checked) =>
                          setEditForm((prev) => ({
                            ...prev,
                            isActive: checked,
                          }))
                        }
                      />
                      <Label>Service Active</Label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Display Current Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground">
                          Nigerian Users (NGN)
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Individual:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                config.ngnPricing.individual,
                                "NGN"
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Employer:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                config.ngnPricing.employer,
                                "NGN"
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Embassy:</span>
                            <span className="font-semibold">
                              {formatCurrency(config.ngnPricing.embassy, "NGN")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground">
                          International Users (USD)
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Individual:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                config.usdPricing.individual,
                                "USD"
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Employer:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                config.usdPricing.employer,
                                "USD"
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Embassy:</span>
                            <span className="font-semibold">
                              {formatCurrency(config.usdPricing.embassy, "USD")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={config.isActive}
                          onCheckedChange={() => handleToggleActive(config.id)}
                        />
                        <Label>Service Active</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Bulk Discount:{" "}
                        {(config.ngnPricing.bulk_discount * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {pricing.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No pricing configuration found
                </h3>
                <p className="text-muted-foreground">
                  Set up your verification pricing to get started.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
