import { API_ENDPOINTS } from "@/lib/api/endpoints";
// FORM
import { useForm } from "react-hook-form";
// ZOD
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, LoginFormSchema } from "../schema/login.schema";
// HOOKS
import useUser from "@/hooks/useUser";
// ROUTE
import { useNavigate } from "react-router";
import { GetResponse, postQueryFormData } from "@/lib/api/queries";
import { toast } from "sonner";
import { User } from "@/components/auth/types/User";

export default function useLoginForm() {
  // HOOKS
  const { login } = useUser();
  const navigate = useNavigate();
  // FORM
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const loggedUser: GetResponse<User> = await postQueryFormData(
        API_ENDPOINTS.AUTH.LOGIN,
        formData
      );

      toast.success("Ha iniciado sesion con éxito");
      login(loggedUser.data)
      if (loggedUser.data.roleId === 2) {
        return navigate("/dashboard", { replace: true });
      }
      return navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("No se pudo iniciar sesion", {
        unstyled: true,
        classNames: {
          error: "bg-red-500 flex gap-2 rounded-md p-4",
        },
      });
    }
  };
  return {
    form,
    handleSubmit,
  };
}
