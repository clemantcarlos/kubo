import { PropsWithChildren} from "react";
// CONTEXT
import { GlobalContext } from "./GlobalContext";
import usePurchaseState from "@/hooks/global/usePurchaseState";

function useGlobalReducer() {
  const purchaseState = usePurchaseState();

  return {
    purchaseState,
  }
}

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  const {
    purchaseState,  
  } = useGlobalReducer();

  return (
    <GlobalContext.Provider
      value={{
        purchase: purchaseState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
