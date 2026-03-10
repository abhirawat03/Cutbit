import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../services/dashboardService";

export const useDashboard = (ready,range) => {
  return useQuery({
    queryKey: ["dashboardStats", range],
    queryFn: () => getDashboardStats(range),
    enabled: ready, 
    staleTime:120000,
  });
};