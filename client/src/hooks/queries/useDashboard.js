import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../services/dashboardService";

export const useDashboard = (range,enabled) => {
  return useQuery({
    queryKey: ["dashboardStats", range],
    queryFn: () => getDashboardStats(range),
    staleTime:1000 * 60 * 2,
    enabled
  });
};