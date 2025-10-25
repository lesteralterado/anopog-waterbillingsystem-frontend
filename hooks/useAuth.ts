import { useAuth as useAuthContext } from '@/context/AuthContext';

export function useAuth() {
  const { user, token, login, signup, logout, isLoading } = useAuthContext();

  const signOut = async () => {
    logout();
  };

  return {
    user,
    loading: isLoading,
    signOut
  };
}
