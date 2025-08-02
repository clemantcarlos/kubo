import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// SERVICES
import { loginUser } from "@/services/auth/user";
// TYPES
import { Response } from "@/services/queries";
import { User, UserWithTokens } from "@/types/auth.type";
// UTILS
import { decryptData, encryptData } from "@/utils/crypto";
// COMPONENTS
import { toast } from "sonner";
import { useNavigate } from "react-router";

// TODO: CAMBIAR TIPOS POR UNOS QUE SIRVAN XD

export default function useUser(){
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const loginMutation = useMutation<Response<UserWithTokens>, Error, { email: string; password: string }>({
    mutationKey: ['user'],
    mutationFn: loginUser,
    onSuccess: (loggedUser) => {
      const { tokens, user } = loggedUser.data
      
      toast.success("Ha iniciado sesion con éxito");
      // Datos del usuario en localStorage (no sensibles)
      localStorage.setItem('user', JSON.stringify(user));
      
      // Tokens en sessionStorage ENCRIPTADOS (datos sensibles)
      sessionStorage.setItem('tokens', encryptData(tokens));
      
      // Cache de React Query
      queryClient.setQueryData(['user'], user);

      // GO TO DASHBOARD
      navigate('/dashboard', { replace: true })
      
      return user;
    },
    onError: (err) => {
      toast.error("No se pudo iniciar sesion", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",  
        },
      });
      throw new Error(err + ' No se pudo iniciar sesion')
    }
  })

  // Query que combina localStorage + React Query cache
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      // 1. Primero intentar obtener del cache de React Query
      const cached = queryClient.getQueryData(['user']);
      if (cached) return cached;
      
      // 2. Si no hay en cache, obtener de localStorage
      const stored = localStorage.getItem('user');
      if (stored) {
        const userData = JSON.parse(stored);
        // 3. Restaurar en cache para futuras consultas
        queryClient.setQueryData(['user'], userData);
        return userData;
      }
      
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - datos frescos
    gcTime: 10 * 60 * 1000,   // 10 minutos - tiempo en cache
  });

  // Método para obtener tokens desencriptados
  const getTokens = () => {
    const encryptedTokens = sessionStorage.getItem('tokens');
    if (!encryptedTokens) return null;
    
    return decryptData(encryptedTokens);
  };

  // Método para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const tokens = getTokens();
    const user = userQuery.data;
    
    // Verificar que existan tokens y que no hayan expirado
    if (!tokens || !user) return false;
    
    // NOTE: verificar expiración del token
    // if (tokens.accessToken && tokens.expiresAt) {
    //   const now = Date.now();
    //   const expiresAt = new Date(tokens.expiresAt).getTime();
    //   if (now > expiresAt) {
    //     logout(); // Auto logout si expiró
    //     return false;
    //   }
    // }
    
    return true;
  };

  // Método para logout
  const logout = () => {
    // Limpiar React Query cache
    queryClient.removeQueries({ queryKey: ['user'] });
    
    // Limpiar localStorage (datos del usuario)
    localStorage.removeItem('user');
    
    // Limpiar sessionStorage (tokens encriptados)
    sessionStorage.removeItem('tokens');
    
    toast.success("Sesión cerrada exitosamente");
  };

  // Método para actualizar datos del usuario
  const updateUserData = (newData: User) => {
    // Actualizar localStorage
    localStorage.setItem('user', JSON.stringify(newData));
    
    // Actualizar React Query cache
    queryClient.setQueryData(['user'], newData);
  };

  return {
    loginMutation,
    userQuery,
    getTokens,
    isAuthenticated,
    logout,
    updateUserData,
  }
}