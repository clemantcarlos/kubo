import { PropsWithChildren} from "react";
// CONTEXT
import { GlobalContext } from "./GlobalContext";
import useProductState from "@/hooks/global/useProductState";
import useSupplierState from "@/hooks/global/useSupplierState";

function useGlobalReducer() {
  const productState = useProductState();
  const supplierState = useSupplierState();
  const purchaseState = useSupplierState();

  return {
    productState,
    supplierState,
    purchaseState,
  }
}

export const GlobalProvider = ({ children }: PropsWithChildren) => {
  const {
    productState,
    supplierState,
    purchaseState,  
  } = useGlobalReducer();

  return (
    <GlobalContext.Provider
      value={{
        product: productState,
        supplier: supplierState,
        purchase: purchaseState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
