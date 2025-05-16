import useUser from '@/hooks/useUser';
import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router';

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (token !== null && token !== undefined) {
      login(token)
      return;
    }
    if (user === null) {
      navigate('/signin', { replace: true });
    }
  }, [login, navigate, user]);

  return children;
}