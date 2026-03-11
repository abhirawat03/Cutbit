import { useCurrentUser } from "./queries/useCurrentUser";

export const useAuth = () => {
  const { data: user, isLoading, isError } = useCurrentUser();
  const isAuthenticated = !!user && !isError;
  return {
    user,
    isLoading,
    isAuthenticated
  };
};