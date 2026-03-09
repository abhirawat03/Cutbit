import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLink } from "../../services/linkService";

export const useDeleteLink = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries(["links"]);
      queryClient.invalidateQueries(["dashboardStats"]);
      queryClient.invalidateQueries(["linkStats"]);
    }
  });
};