import { useCurrentUser } from "./queries/useCurrentUser";

export const useAuth = () => {
  const { data: user, isLoading, isError } = useCurrentUser();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isError
  };
};