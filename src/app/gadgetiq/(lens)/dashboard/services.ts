import { lensFetch } from "../core/client";
import { DashboardStats } from "./types";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await lensFetch<DashboardStats>("/admin/stats");
    return (
      res.data ||
      (res as unknown as DashboardStats) || {
        totalUsers: 0,
        totalReports: 0,
        avgScore: 0,
        reportsToday: 0,
        reportsPerDay: [],
        gradeDistribution: {},
        topGraders: [],
      }
    );
  },
};
