import { useMutation } from "@tanstack/react-query";
import { updateAvatar } from "../../services/userService";

export const useUpdateAvatar = () => {

  return useMutation({
    mutationFn: updateAvatar,
  });
};