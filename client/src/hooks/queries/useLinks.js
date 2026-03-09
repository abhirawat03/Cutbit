import { useQuery } from "@tanstack/react-query";
import { getLinks } from "../../services/linkService";

export const useLinks = () => {
  return useQuery({
    queryKey: ["links"],
    queryFn: getLinks,
    keepPreviousData: true
  });
};