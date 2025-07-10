import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getQuery } from "@/lib/api/queries";
import { Supplier } from "@/modules/Inventory/suppliers/types/supplier.type";
import { initialState, supplierReducer } from "@/reducers/supplier";
import { useCallback, useReducer } from "react";

export default function useSupplierState() {
  const [supplierState, supplierDispatch] = useReducer(
    supplierReducer,
    initialState
  );

  const getSuppliers = useCallback(
    async (page: number, search?: string) => {
      const controller = new AbortController();
      try {
        if (search && search.length > 0) {
          const res = await getQuery<Supplier[]>(
            API_ENDPOINTS.SUPPLIERS.BASE_GET(page, 10, search),
            controller.signal
          );
          supplierDispatch({
            type: "GET_SUPPLIERS",
            payload: res,
          });
          return;
        }

        const res = await getQuery<Supplier[]>(
          API_ENDPOINTS.SUPPLIERS.BASE_GET(page, 10),
          controller.signal
        );
        supplierDispatch({ type: 'GET_SUPPLIERS', payload: res });
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") console.error(err);
        } else {
          console.error("Error desconocido", err);
        }
      } finally {
        controller.abort();
      }
    },
    [supplierDispatch]
  );
  const getSupplier = async () => {};
  const addSupplier = async () => {};
  const updateSupplier = async () => {};
  const deleteSupplier = async () => {};

  return {
    value: supplierState,
    methods: {
      getSupplier,
      getSuppliers,
      addSupplier,
      updateSupplier,
      deleteSupplier,
    },
  };
}
