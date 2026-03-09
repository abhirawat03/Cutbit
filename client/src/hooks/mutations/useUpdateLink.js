import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLink } from "../../services/linkService";

export const useUpdateLink = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"]});
    }
  });
};