import { UserWithTokens } from "@/types/auth.type";
import { API_ENDPOINTS } from "../endpoints";
import { postQueryJson, Response } from "../queries";

export const loginUser = async (
  {email, password}: {email: string, password: string}
): Promise<Response<UserWithTokens>>  => {
  return await postQueryJson<UserWithTokens, {email: string, password: string}>(
    API_ENDPOINTS.AUTH.LOGIN,
    { email, password}
  );
}