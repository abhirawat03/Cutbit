import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAvatar } from "../../services/userService";

export const useDeleteAvatar = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAvatar,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }
  });
};