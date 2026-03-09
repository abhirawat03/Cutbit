import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../services/dashboardService";

export const useDashboard = (range) => {
  return useQuery({
    queryKey: ["dashboardStats", range],
    queryFn: () => getDashboardStats(range),
    keepPreviousData: true
  });
};