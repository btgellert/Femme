import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useRecoilState } from 'recoil';
import { authState } from '@store/atoms/auth';
import { authService, LoginData, RegisterData } from '@services/api/auth';

export function useAuth() {
  const [auth, setAuth] = useRecoilState(authState);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setAuth({ user, loading: false });
      } catch (error) {
        setAuth({ user: null, loading: false });
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!auth.loading && auth.user && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth pages
      router.replace('/');
    }
  }, [auth.user, auth.loading, segments]);

  const login = async (data: LoginData) => {
    const { session } = await authService.login(data);
    if (session?.user) {
      setAuth({ user: session.user, loading: false });
    }
  };

  const register = async (data: RegisterData) => {
    const { session } = await authService.register(data);
    if (session?.user) {
      setAuth({ user: session.user, loading: false });
    }
  };

  const logout = async () => {
    await authService.logout();
    setAuth({ user: null, loading: false });
  };

  return {
    user: auth.user,
    loading: auth.loading,
    login,
    register,
    logout,
  };
}