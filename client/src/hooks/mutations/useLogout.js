import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      navigate("/");
    },
  });
};
