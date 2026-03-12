import { useQuery } from "@tanstack/react-query";
import { getLinks } from "../../services/linkService";

export const useLinks = (page) => {
  return useQuery({
    queryKey: ["links", page],
    queryFn:()=> getLinks(page),
    keepPreviousData: true,
    staleTime: 60000
  });
};