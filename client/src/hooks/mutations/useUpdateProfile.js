import { useMutation, useQueryClient} from "@tanstack/react-query";
import { updateProfile } from "../../services/userService";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      // ⚡ instant UI update
      queryClient.setQueryData(["me"], updatedUser);
    },
  });
};