"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { DollarSign, TrendingUp, CreditCard, Users, RefreshCw, Download, AlertTriangle } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import {
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
} from "recharts"

interface PaymentAnalytics {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  totalTransactions: number
  successfulTransactions: number
  failedTransactions: number
  successRate: number
  averageTransactionValue: number
  revenueByPlan: Array<{
    planType: string
    revenue: number
    count: number
  }>
  revenueByCountry: Array<{
    country: string
    revenue: number
    currency: string
  }>
  monthlyTrends: Array<{
    month: string
    revenue: number
    transactions: number
    successRate: number
  }>
  paymentMethods: Array<{
    method: string
    count: number
    percentage: number
  }>
}

const COLORS = {
  primary: "hsl(var(--primary))",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  muted: "hsl(var(--muted-foreground))",
}

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function PaymentAnalytics() {
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState("30d")
  const [refreshing, setRefreshing] = useState(false)

  const api = useApi()
  const { toast } = useToast()

  const fetchPaymentAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.getPaymentAnalytics(timeframe)

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch payment analytics")
      }

      if (!response.data) {
        throw new Error("Payment analytics data is missing")
      }

      setAnalytics(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load payment analytics"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchPaymentAnalytics()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchPaymentAnalytics()
  }, [timeframe])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Failed to Load Payment Analytics</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchPaymentAnalytics}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Analytics</h1>
          <p className="text-muted-foreground">Revenue insights and payment performance metrics</p>
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
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.revenueGrowth >= 0 ? "+" : ""}
              {analytics.revenueGrowth.toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₦{analytics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.successfulTransactions} of {analytics.totalTransactions} successful
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ₦{analytics.averageTransactionValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Average payment value</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue and transaction volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue (₦)", color: COLORS.success },
                transactions: { label: "Transactions", color: COLORS.info },
              }}
              className="h-[300px]"
            >
              <AreaChart data={analytics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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

        {/* Revenue by Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>Revenue distribution across subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                individual: { label: "Individual", color: PIE_COLORS[0] },
                employer: { label: "Employer", color: PIE_COLORS[1] },
                government: { label: "Government", color: PIE_COLORS[2] },
              }}
              className="h-[300px]"
            >
              <RechartsPieChart>
                <Pie
                  data={analytics.revenueByPlan}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ planType, revenue }) => `${planType}: ₦${revenue.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {analytics.revenueByPlan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Popular payment methods used by customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Transactions", color: COLORS.primary },
              }}
              className="h-[300px]"
            >
              <BarChart data={analytics.paymentMethods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill={COLORS.primary} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Geographic Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Country</CardTitle>
            <CardDescription>Geographic distribution of revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: COLORS.success },
              }}
              className="h-[300px]"
            >
              <BarChart data={analytics.revenueByCountry} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill={COLORS.success} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Transactions</span>
              <Badge variant="outline">{analytics.totalTransactions.toLocaleString()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Successful</span>
              <Badge className="bg-green-100 text-green-800">{analytics.successfulTransactions}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Failed</span>
              <Badge className="bg-red-100 text-red-800">{analytics.failedTransactions}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.revenueByPlan
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 3)
              .map((plan, index) => (
                <div key={plan.planType} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full bg-${index === 0 ? "green" : index === 1 ? "blue" : "yellow"}-500`}
                    />
                    <span className="text-sm capitalize">{plan.planType}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₦{plan.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{plan.count} subscriptions</div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Most Used Method</span>
              <Badge variant="outline">
                {analytics.paymentMethods.sort((a, b) => b.count - a.count)[0]?.method || "N/A"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Success Rate</span>
              <Badge className="bg-green-100 text-green-800">{analytics.successRate.toFixed(1)}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Growth Rate</span>
              <Badge
                className={analytics.revenueGrowth >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {analytics.revenueGrowth >= 0 ? "+" : ""}
                {analytics.revenueGrowth.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
