// FORM
import { useForm } from "react-hook-form";
// ZOD
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, LoginFormSchema } from "../schema/login.schema";
// HOOKS
import useUser from "@/queryHooks/useUser";

// QUERY
// TODO: MAKE A PULL REQUEST TO TANSTACK QUERY TO ADD FETCH STATUS EXAMPLE
export default function useLoginForm() {
  const { loginMutation } = useUser();
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
    loginMutation.mutateAsync({
      email: form.getValues().email,  
      password: form.getValues().password
    })
  };

  return {
    form,
    handleSubmit,
  };
}
