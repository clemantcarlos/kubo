import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { GlobalContextType } from "@/types/globalContext.type";

export default function useGlobal(): GlobalContextType {
  const global = useContext(GlobalContext)

  if (global=== null || global === undefined) {
    throw new Error('GlobalContext must be used within a UserProvider')
  }

  return global
} 