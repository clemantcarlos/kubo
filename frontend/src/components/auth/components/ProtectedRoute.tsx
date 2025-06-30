// import useUser from '@/hooks/useUser';
import { 
  PropsWithChildren, 
  // useEffect 
} from 'react';
// import { useNavigate } from 'react-router';

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // const { user, login } = useUser();
  // const navigate = useNavigate();

  // TODO: DESCOMENTAR EL CODIGO EN PRODUCCION

  // useEffect(() => {
  //   const token = localStorage.getItem('user-token');
  //   if (user === null || user === undefined) {
  //     // TODO: HACER UNA PAGINA DE ERROR Y LUEGO REDIRIGIR 
  //     navigate('/signin', { replace: true });
  //     return
  //   }
  //   if (token !== null || token !== undefined) {
  //     login(token)
  //   }
  // }, [login, navigate, user]);

  return children;
}