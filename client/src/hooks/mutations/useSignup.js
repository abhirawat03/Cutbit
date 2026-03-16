import { useMutation } from "@tanstack/react-query"
import { signupUser } from "../../services/userService"

export const useSignup = () => {
    return useMutation({
        mutationFn: signupUser
    })
}