import { PropsWithChildren} from "react";
// CONTEXT
import { GlobalContext } from "./GlobalContext";
import useProductState from "@/hooks/global/useProductState";
import useSupplierState from "@/hooks/global/useSupplierState";

function useGlobalReducer() {
  const productState = useProductState();
  const supplierState = useSupplierState();

  return {
    productState,
    supplierState
  }
}

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  const {
    productState,
    supplierState,  
  } = useGlobalReducer();

  return (
    <GlobalContext.Provider
      value={{
        product: productState,
        supplier: supplierState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
