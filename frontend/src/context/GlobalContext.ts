import { createContext } from "react";
import { GlobalContextType } from "@/types/globalContext.type";

export const GlobalContext = createContext<GlobalContextType | null>(null);
