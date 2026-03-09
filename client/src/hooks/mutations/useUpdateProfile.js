import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../services/userService";

export const useUpdateProfile = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }
  });
};