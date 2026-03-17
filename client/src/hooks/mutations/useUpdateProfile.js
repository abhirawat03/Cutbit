import { useMutation} from "@tanstack/react-query";
import { updateProfile } from "../../services/userService";

export const useUpdateProfile = () => {

  return useMutation({
    mutationFn: updateProfile,
  });
};