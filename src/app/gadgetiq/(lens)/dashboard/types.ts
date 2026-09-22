export interface DailyReportVolume {
  date: string;
  count: number | string;
}

export interface TopGraderPerformance {
  userId: string | number;
  reportCount: number;
  avgScore: number;
  user?: {
    id: string | number;
    name?: string;
    username: string;
    email?: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalReports: number;
  avgScore: number;
  reportsToday: number;
  reportsPerDay: DailyReportVolume[];
  gradeDistribution: Record<string, number>;
  topGraders: TopGraderPerformance[];
}
