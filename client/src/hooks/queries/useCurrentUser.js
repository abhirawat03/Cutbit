import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/userService";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: getCurrentUser,
        staleTime: 1000 * 60 * 5, // ✅ cache for 5 min
        refetchOnMount: false,   // ✅ don't spam
        refetchOnWindowFocus: false, // ✅ stop loop
        retry: false,
    });
};