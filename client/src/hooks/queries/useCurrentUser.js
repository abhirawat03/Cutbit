import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/userService";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: getCurrentUser,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};