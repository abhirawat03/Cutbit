import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../services/authService.js";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
    });
};