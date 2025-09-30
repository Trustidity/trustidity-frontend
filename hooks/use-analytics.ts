"use client";

import { useState, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

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

interface UseAnalyticsReturn {
  // Data
  analyticsData: AnalyticsData | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchAnalytics: (startDate?: string, endDate?: string) => Promise<void>;
  exportAnalytics: (format: "csv" | "pdf") => Promise<void>;

  // Utility
  refreshAnalytics: () => Promise<void>;
  resetError: () => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useApi();
  const { toast } = useToast();

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const fetchAnalytics = useCallback(
    async (startDate?: string, endDate?: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getAnalyticsDashboard(startDate, endDate);

        if (response.success && response.data) {
          setAnalyticsData(response.data);
        } else {
          const errorMessage =
            response.error || "Failed to fetch analytics data";
          setError(errorMessage);
          toast({
            title: "Error",
            description: errorMessage,
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
    },
    [api, toast]
  );

  const exportAnalytics = useCallback(
    async (format: "csv" | "pdf") => {
      try {
        if (!analyticsData) {
          toast({
            title: "Error",
            description: "No analytics data available to export",
            variant: "destructive",
          });
          return;
        }

        // Create export data
        const exportData = {
          summary: {
            totalVerifications: analyticsData.totalVerifications,
            successfulVerifications: analyticsData.successfulVerifications,
            failedVerifications: analyticsData.failedVerifications,
            successRate:
              analyticsData.totalVerifications > 0
                ? (
                    (analyticsData.successfulVerifications /
                      analyticsData.totalVerifications) *
                    100
                  ).toFixed(2)
                : "0",
            totalRevenue: analyticsData.revenueData.total,
            monthlyGrowth: analyticsData.revenueData.growth.toFixed(2),
          },
          trends: analyticsData.verificationTrends,
          topInstitutions: analyticsData.topInstitutions,
          geographicData: analyticsData.geographicData,
          fraudStats: analyticsData.fraudDetectionStats,
        };

        if (format === "csv") {
          // Convert to CSV and download
          const csvContent = convertToCSV(exportData);
          downloadFile(csvContent, "analytics-report.csv", "text/csv");
        } else {
          // For PDF, we'd need a PDF generation library
          toast({
            title: "Info",
            description: "PDF export feature coming soon",
          });
        }

        toast({
          title: "Success",
          description: `Analytics data exported as ${format.toUpperCase()}`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description:
            err instanceof Error
              ? err.message
              : "Failed to export analytics data",
          variant: "destructive",
        });
      }
    },
    [analyticsData, toast]
  );

  const refreshAnalytics = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    // Data
    analyticsData,
    loading,
    error,

    // Actions
    fetchAnalytics,
    exportAnalytics,

    // Utility
    refreshAnalytics,
    resetError,
  };
};

// Helper function to convert data to CSV
function convertToCSV(data: any): string {
  const headers = ["Metric", "Value"];
  const rows = [
    ["Total Verifications", data.summary.totalVerifications],
    ["Successful Verifications", data.summary.successfulVerifications],
    ["Failed Verifications", data.summary.failedVerifications],
    ["Success Rate (%)", data.summary.successRate],
    ["Total Revenue (₦)", data.summary.totalRevenue],
    ["Monthly Growth (%)", data.summary.monthlyGrowth],
  ];

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
}

// Helper function to download file
function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
