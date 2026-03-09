import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAvatar } from "../../services/userService";

export const useUpdateAvatar = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvatar,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }
  });
};