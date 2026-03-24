import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/userService";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch (err) {
        if (err.response?.status === 401) {
          return null; // ✅ not logged in
        }
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false, // important
    refetchOnWindowFocus: false,
    retry: false,
  });
};