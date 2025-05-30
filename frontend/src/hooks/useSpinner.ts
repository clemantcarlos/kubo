import { useContext } from "react";
import { SpinnerContext } from "@/context/Spinner";

export default function useSpinner() {
  const spinner = useContext(SpinnerContext)

  if (spinner=== null || spinner === undefined) {
    throw new Error('SpinnerContext must be used within a UserProvider')
  }

  return spinner
} 