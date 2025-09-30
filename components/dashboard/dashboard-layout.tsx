"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CustomDropdown,
  CustomDropdownItem,
  CustomDropdownLabel,
  CustomDropdownSeparator,
} from "@/components/ui/custom-dropdown"
import { Shield, Menu, X, LogOut, Settings, User, Loader2 } from "lucide-react"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
  navigation: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    current?: boolean
  }>
}

export function DashboardLayout({ children, navigation }: DashboardLayoutProps) {
  const { auth, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const firstName = auth.user?.firstName || ""
  const lastName = auth.user?.lastName || ""
  const fullName = `${firstName} ${lastName}`.trim() || "Loading..."
  const initial = firstName && lastName ? firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase() : "?"

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r">
          <div className="flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-sidebar-primary" />
              <span className="text-lg font-bold text-sidebar-foreground">Trustidity</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      item.current
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-sidebar lg:border-r">
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-bold text-sidebar-foreground">Trustidity</span>
          </Link>
        </div>
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    item.current
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {auth.isLoading ? (
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : (
                <CustomDropdown
                  trigger={
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">{initial}</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                  align="end"
                >
                  <CustomDropdownLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{auth.user?.email}</p>
                    </div>
                  </CustomDropdownLabel>
                  <CustomDropdownSeparator />
                  <CustomDropdownItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </CustomDropdownItem>
                  <CustomDropdownItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </CustomDropdownItem>
                  <CustomDropdownSeparator />
                  <CustomDropdownItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </CustomDropdownItem>
                </CustomDropdown>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
