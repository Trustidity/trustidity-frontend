"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Settings,
  Shield,
  Database,
  Mail,
  Bell,
  Activity,
  DollarSign,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"

interface SystemSettings {
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailNotifications: boolean
  autoApproveInstitutions: boolean
  maxVerificationsPerDay: number
  defaultCurrency: string
  supportEmail: string
  systemName: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: "super_admin" | "admin" | "moderator"
  status: "active" | "inactive"
  lastLogin: string
  permissions: string[]
}

export default function AdminManagementPanel() {
  const api = useApi()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    autoApproveInstitutions: false,
    maxVerificationsPerDay: 1000,
    defaultCurrency: "NGN",
    supportEmail: "support@trustidity.com",
    systemName: "Trustidity",
  })

  const [adminUsers] = useState<AdminUser[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@trustidity.com",
      role: "super_admin",
      status: "active",
      lastLogin: "2024-01-15T10:30:00Z",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@trustidity.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-14T15:45:00Z",
      permissions: ["users", "institutions", "analytics"],
    },
  ])

  const handleSettingsUpdate = async (key: keyof SystemSettings, value: any) => {
    try {
      setLoading(true)
      setSettings((prev) => ({ ...prev, [key]: value }))

      // API call would go here
      // await api.updateSystemSettings({ [key]: value })

      toast({
        title: "Settings Updated",
        description: "System settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const systemStats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Sessions",
      value: "1,234",
      change: "+5%",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "Stable",
      icon: Shield,
      color: "text-emerald-600",
    },
    {
      title: "Revenue Today",
      value: "₦45,678",
      change: "+8%",
      icon: DollarSign,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="admins">Admin Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>Configure global system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable to put system in maintenance mode</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleSettingsUpdate("maintenanceMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>User Registration</Label>
                      <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                    </div>
                    <Switch
                      checked={settings.registrationEnabled}
                      onCheckedChange={(checked) => handleSettingsUpdate("registrationEnabled", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send system email notifications</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingsUpdate("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-approve Institutions</Label>
                      <p className="text-sm text-muted-foreground">Automatically approve new institutions</p>
                    </div>
                    <Switch
                      checked={settings.autoApproveInstitutions}
                      onCheckedChange={(checked) => handleSettingsUpdate("autoApproveInstitutions", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">System Name</Label>
                    <Input
                      id="systemName"
                      value={settings.systemName}
                      onChange={(e) => handleSettingsUpdate("systemName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleSettingsUpdate("supportEmail", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxVerifications">Max Verifications/Day</Label>
                    <Input
                      id="maxVerifications"
                      type="number"
                      value={settings.maxVerificationsPerDay}
                      onChange={(e) => handleSettingsUpdate("maxVerificationsPerDay", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <Input
                      id="defaultCurrency"
                      value={settings.defaultCurrency}
                      onChange={(e) => handleSettingsUpdate("defaultCurrency", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Administrator Management
              </CardTitle>
              <CardDescription>Manage admin users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminUsers.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${admin.email}`} />
                        <AvatarFallback>
                          {admin.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={admin.role === "super_admin" ? "default" : "secondary"}>
                        {admin.role.replace("_", " ")}
                      </Badge>
                      <Badge variant={admin.status === "active" ? "default" : "destructive"}>{admin.status}</Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security policies and monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Login Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Two-Factor Authentication</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Session Timeout (minutes)</Label>
                      <Input type="number" defaultValue="30" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Max Login Attempts</Label>
                      <Input type="number" defaultValue="5" className="w-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">API Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Rate Limiting</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>API Key Rotation (days)</Label>
                      <Input type="number" defaultValue="90" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>CORS Enabled</Label>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Maintenance
              </CardTitle>
              <CardDescription>Database maintenance and system cleanup tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Database Operations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Activity className="h-4 w-4 mr-2" />
                      System Health Check
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cleanup Operations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Clear Email Queue
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Bell className="h-4 w-4 mr-2" />
                      Clear Notifications
                    </Button>
                    <Button variant="destructive" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
