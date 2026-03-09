import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "../../services/linkService";

export const useCreateLink = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"]});
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"]});
    }
  });
};