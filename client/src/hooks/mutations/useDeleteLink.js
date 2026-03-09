import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLink } from "../../services/linkService";

export const useDeleteLink = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"]});
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"]});
      queryClient.invalidateQueries({ queryKey: ["linkStats"]});
    }
  });
};