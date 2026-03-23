import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../services/authService.js";

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
    });
};