import { useQuery } from "@tanstack/react-query";
import { getLink } from "../../services/linkService";

export const useLink = (id) => {
  return useQuery({
    queryKey: ["link",id],
    queryFn:()=> getLink(id),
    keepPreviousData: true,
    staleTime: 60000
  });
};