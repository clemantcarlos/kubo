import { useContext } from "react";
import { UserContext } from "@/context/user";

export default function useUser() {
  const user = useContext(UserContext)

  if (user=== null || user === undefined) {
    throw new Error('UserContext must be used within a UserProvider')
  }

  return user
} 