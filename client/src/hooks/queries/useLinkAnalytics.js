import { useQuery } from "@tanstack/react-query";
import { getLinkAnalytics } from "../../services/linkService";

export const useLinkAnalytics = (id,range) => {
  return useQuery({
    queryKey: ["links", id, range],
    queryFn:()=> getLinkAnalytics(id, range),
    keepPreviousData: true,
    staleTime: 60000
  });
};