import { useMutation} from "@tanstack/react-query";
import { deleteAvatar } from "../../services/userService";

export const useDeleteAvatar = () => {

  return useMutation({
    mutationFn: deleteAvatar,
  });
};