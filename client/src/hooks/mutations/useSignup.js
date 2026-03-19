import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signupUser } from "../../services/userService"

export const useSignup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: signupUser,
        onSuccess: () => {
      // 🔥 SAME PATTERN AS LOGIN
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    })
}