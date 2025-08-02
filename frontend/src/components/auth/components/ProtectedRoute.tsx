import { 
  PropsWithChildren, 
} from 'react';
import { Navigate } from 'react-router';

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {

  window.addEventListener("storage", (e) => {
    console.log(e)
    if (e.key === "user-token") {
      console.log("Token updated");
    }
  });

  const token = localStorage.getItem('user-token');

  return token !== null && token !== undefined ? (
    children
  ) : (
    <Navigate to="/signin" replace />
  )
}
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (token === null || token === undefined) {
  //     // TODO: HACER UNA PAGINA DE ERROR Y LUEGO REDIRIGIR 
  //     navigate('/signin', { replace: true });
  //     return
  //   }
  //   console.log(token)
  // }, [navigate]);

  // return children;