"use client";

import { useState } from "react";
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
} from "lucide-react";
import { DEFAULT_PRICING, type PricingConfig } from "@/lib/pricing";
import { formatCurrency } from "@/lib/geolocation";

export function AdminPricing() {
  const [pricing, setPricing] = useState<PricingConfig[]>(DEFAULT_PRICING);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PricingConfig>>({});

  const handleEdit = (config: PricingConfig) => {
    setEditingId(config.id);
    setEditForm(config);
  };

  const handleSave = () => {
    if (!editingId || !editForm) return;

    setPricing((prev) =>
      prev.map((p) =>
        p.id === editingId ? ({ ...p, ...editForm } as PricingConfig) : p
      )
    );
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleToggleActive = (id: string) => {
    setPricing((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const totalServices = pricing.length;
  const activeServices = pricing.filter((p) => p.isActive).length;
  const avgPriceNGN = Math.round(
    pricing.reduce((sum, p) => sum + p.priceNGN, 0) / pricing.length
  );
  const avgPriceUSD = Math.round(
    pricing.reduce((sum, p) => sum + p.priceUSD, 0) / pricing.length
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Pricing Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure verification prices for different credential types and
            currencies
          </p>
        </div>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
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
                        Type: {config.credentialType.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={config.isActive ? "default" : "secondary"}>
                      {config.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {editingId === config.id ? (
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`ngn-${config.id}`}>Price (NGN)</Label>
                        <Input
                          id={`ngn-${config.id}`}
                          type="number"
                          value={editForm.priceNGN || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              priceNGN: Number.parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="Enter price in Naira"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`usd-${config.id}`}>Price (USD)</Label>
                        <Input
                          id={`usd-${config.id}`}
                          type="number"
                          value={editForm.priceUSD || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              priceUSD: Number.parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="Enter price in Dollars"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`desc-${config.id}`}>Description</Label>
                      <Input
                        id={`desc-${config.id}`}
                        value={editForm.description || ""}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter service description"
                      />
                    </div>
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Nigerian Users
                        </Label>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-bold text-foreground">
                            {formatCurrency(config.priceNGN, "NGN")}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            per verification
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          International Users
                        </Label>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-bold text-foreground">
                            {formatCurrency(config.priceUSD, "USD")}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            per verification
                          </span>
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
                        Last updated: Today
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
