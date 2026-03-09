import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../services/linkService";

export const useLinkStats = () => {
  return useQuery({
    queryKey: ["linkStats"],
    queryFn: getStats,
    keepPreviousData: true
  });
};