import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/userService";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    retry: false,

    staleTime: 0,              // don't trust old auth
    cacheTime: 5 * 60 * 1000,  // keep in memory for reuse

    refetchOnMount: true,      // verify when needed
    refetchOnWindowFocus: false,
  });
};