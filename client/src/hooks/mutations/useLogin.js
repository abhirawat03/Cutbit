import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../../services/userService";

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
      // 🔥 fetch fresh user after login
            queryClient.invalidateQueries(["me"]);
        },
    });
};