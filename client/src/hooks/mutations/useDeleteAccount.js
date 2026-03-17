import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../../services/userService";

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccount,
  });
};