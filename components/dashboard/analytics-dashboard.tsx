"use client";

import { DashboardLayout } from "./dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Users,
  Building,
  FileText,
  Shield,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Download,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
} from "recharts";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Shield },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    current: true,
  },
  { name: "User Management", href: "/dashboard/users", icon: Users },
  { name: "Institutions", href: "/dashboard/institutions", icon: Building },
  { name: "System Logs", href: "/dashboard/logs", icon: FileText },
];

interface AnalyticsData {
  totalVerifications: number;
  successfulVerifications: number;
  failedVerifications: number;
  totalCredentials: number;
  totalInstitutions: number;
  totalUsers: number;
  revenueData: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  verificationTrends: Array<{
    date: string;
    count: number;
    success: number;
    failed: number;
  }>;
  topInstitutions: Array<{
    name: string;
    credentialCount: number;
    verificationCount: number;
  }>;
  geographicData: Array<{
    country: string;
    region: string;
    count: number;
  }>;
  fraudDetectionStats: {
    totalFlagged: number;
    falsePositives: number;
    truePositives: number;
    accuracy: number;
  };
}

const COLORS = {
  primary: "hsl(var(--primary))",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  muted: "hsl(var(--muted-foreground))",
};

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const api = useApi();
  const { toast } = useToast();

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getAnalyticsDashboard();

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch analytics data");
      }

      if (!response.data) {
        throw new Error("Analytics data is missing");
      }

      setAnalyticsData(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load analytics data";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [api, toast]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Prepare chart data
  const verificationStatusData = analyticsData
    ? [
        {
          name: "Successful",
          value: analyticsData.successfulVerifications,
          color: COLORS.success,
        },
        {
          name: "Failed",
          value: analyticsData.failedVerifications,
          color: COLORS.danger,
        },
        {
          name: "Pending",
          value:
            analyticsData.totalVerifications -
            analyticsData.successfulVerifications -
            analyticsData.failedVerifications,
          color: COLORS.warning,
        },
      ]
    : [];

  const revenueChartData =
    analyticsData?.verificationTrends.map((trend) => ({
      date: new Date(trend.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: trend.success * 500, // Assuming ₦500 per successful verification
      verifications: trend.count,
    })) || [];

  const topInstitutionsData =
    analyticsData?.topInstitutions.slice(0, 8).map((inst) => ({
      name:
        inst.name.length > 20 ? inst.name.substring(0, 20) + "..." : inst.name,
      verifications: inst.verificationCount,
      credentials: inst.credentialCount,
    })) || [];

  const geographicChartData =
    analyticsData?.geographicData.slice(0, 10).map((geo) => ({
      location: `${geo.country}${
        geo.region !== "Unknown" ? ` - ${geo.region}` : ""
      }`,
      count: geo.count,
    })) || [];

  if (loading) {
    return (
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Comprehensive system analytics and insights
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive system analytics and insights
            </p>
          </div>
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Failed to Load Analytics
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchAnalyticsData}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive system analytics and insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Verifications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.totalVerifications.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.successfulVerifications} successful
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {analyticsData.totalVerifications > 0
                  ? Math.round(
                      (analyticsData.successfulVerifications /
                        analyticsData.totalVerifications) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.failedVerifications} failed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₦{analyticsData.revenueData.thisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.revenueData.growth >= 0 ? "+" : ""}
                {analyticsData.revenueData.growth.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fraud Detection
              </CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {analyticsData.fraudDetectionStats.accuracy.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.fraudDetectionStats.totalFlagged} flagged
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Trends</CardTitle>
              <CardDescription>
                Daily verification activity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: { label: "Total", color: COLORS.primary },
                  success: { label: "Successful", color: COLORS.success },
                  failed: { label: "Failed", color: COLORS.danger },
                }}
                className="h-[300px]"
              >
                <LineChart data={analyticsData.verificationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="success"
                    stroke={COLORS.success}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="failed"
                    stroke={COLORS.danger}
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Verification Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Distribution of verification outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  successful: { label: "Successful", color: COLORS.success },
                  failed: { label: "Failed", color: COLORS.danger },
                  pending: { label: "Pending", color: COLORS.warning },
                }}
                className="h-[300px]"
              >
                <RechartsPieChart>
                  <Pie
                    data={verificationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {verificationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Daily revenue from successful verifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: { label: "Revenue (₦)", color: COLORS.success },
                  verifications: { label: "Verifications", color: COLORS.info },
                }}
                className="h-[300px]"
              >
                <AreaChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke={COLORS.success}
                    fill={COLORS.success}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Institutions */}
          <Card>
            <CardHeader>
              <CardTitle>Top Institutions</CardTitle>
              <CardDescription>
                Institutions by verification volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  verifications: {
                    label: "Verifications",
                    color: COLORS.primary,
                  },
                  credentials: { label: "Credentials", color: COLORS.info },
                }}
                className="h-[300px]"
              >
                <BarChart data={topInstitutionsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="verifications" fill={COLORS.primary} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Verification requests by location</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Verifications", color: COLORS.primary },
              }}
              className="h-[400px]"
            >
              <BarChart data={geographicChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="location"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill={COLORS.primary} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* System Health & Fraud Detection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Total Users</span>
                </div>
                <Badge variant="outline">
                  {analyticsData.totalUsers.toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Institutions</span>
                </div>
                <Badge variant="outline">
                  {analyticsData.totalInstitutions}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Credentials</span>
                </div>
                <Badge variant="outline">
                  {analyticsData.totalCredentials.toLocaleString()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Flagged</span>
                <Badge variant="outline" className="text-red-600">
                  {analyticsData.fraudDetectionStats.totalFlagged}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">True Positives</span>
                <Badge variant="outline" className="text-green-600">
                  {analyticsData.fraudDetectionStats.truePositives}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">False Positives</span>
                <Badge variant="outline" className="text-yellow-600">
                  {analyticsData.fraudDetectionStats.falsePositives}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Accuracy</span>
                <Badge variant="outline" className="text-blue-600">
                  {analyticsData.fraudDetectionStats.accuracy.toFixed(1)}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Revenue</span>
                <Badge variant="outline" className="text-green-600">
                  ₦{analyticsData.revenueData.total.toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">This Month</span>
                <Badge variant="outline" className="text-green-600">
                  ₦{analyticsData.revenueData.thisMonth.toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Month</span>
                <Badge variant="outline">
                  ₦{analyticsData.revenueData.lastMonth.toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Growth</span>
                <Badge
                  variant="outline"
                  className={
                    analyticsData.revenueData.growth >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {analyticsData.revenueData.growth >= 0 ? "+" : ""}
                  {analyticsData.revenueData.growth.toFixed(1)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
