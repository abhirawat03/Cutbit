import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/userService";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    keepPreviousData: true,
    staleTime: Infinity
  });
};