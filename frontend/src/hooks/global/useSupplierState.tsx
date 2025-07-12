import { useCallback, useReducer } from "react";
//  REDUCERS
import { initialState, supplierReducer } from "@/reducers/supplier";
// SCHEMAS
import { SupplierFormSchema } from "@/modules/Inventory/suppliers/schema/supplier.schema";
// TYPES
import { Supplier } from "@/modules/Inventory/suppliers/types/supplier.type";
// UTILS
import { 
  deleteQuery,
  getQuery, 
  postQueryJson, 
  putQueryJson 
} from "@/lib/api/queries";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
// COMPONENTS
import { toast } from "sonner";

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
        supplierDispatch({ type: "GET_SUPPLIERS", payload: res });
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
  const getSupplier = useCallback(
    async (id: string) => {
      const controller = new AbortController();
      const findSupplier = supplierState.data.find(
        (supplier) => supplier.id === id
      );

      if (findSupplier)
        return { success: true, data: findSupplier, meta: supplierState.meta };

      try {
        const res = await getQuery<Supplier>(
          API_ENDPOINTS.SUPPLIERS.BY_ID(id),
          controller.signal
        );
        return res;
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
    [supplierState]
  );
  const addSupplier = async (supplier: SupplierFormSchema) => {
    const controller = new AbortController();
    try {
      const newSupplier = await postQueryJson<Supplier, SupplierFormSchema>(
        API_ENDPOINTS.PRODUCTS.BASE,
        supplier,
        controller.signal
      );
      supplierDispatch({
        type: "ADD_SUPPLIER",
        payload: newSupplier.data,
      });
      toast.success("Proveedor creado exitosamente");
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== "AbortError") {
          toast.error("No se pudo crear el Proveedor", {
            unstyled: true,
            classNames: {
              error: "bg-red-500 flex gap-2 rounded-md p-4",
            },
          });
        }
      } else {
        toast.error("No se pudo actualizar el Proveedor", {
          unstyled: true,
          classNames: {
            error: "bg-red-500 flex gap-2 rounded-md p-4",
          },
        });
      }
    } finally {
      controller.abort();
    }
  };
  const updateSupplier = async (id: string, supplier: SupplierFormSchema)  => {
      const controller = new AbortController();
      try {
        const updatedSupplier = await putQueryJson<Supplier, SupplierFormSchema>(
          API_ENDPOINTS.SUPPLIERS.BY_ID(id),
          supplier,
          controller.signal
        );
        supplierDispatch({
          type: "UPDATE_SUPPLIER",
          payload: updatedSupplier.data,
        });
        toast.success("Proveedor actualizado exitosamente");
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") {
            toast.error("No se pudo actualizar el Proveedor", {
              unstyled: true,
              classNames: {
                error: "bg-red-500 flex gap-2 rounded-md p-4",
              },
            });
          }
        } else {
          toast.error("No se pudo actualizar el Proveedor", {
            unstyled: true,
            classNames: {
              error: "bg-red-500 flex gap-2 rounded-md p-4",
            },
          });
        }
      } finally {
        controller.abort();
      }
    };
  const deleteSupplier = useCallback(
      async (id: string) => {
        const controller = new AbortController();
        try {
          await deleteQuery<Supplier>(
            API_ENDPOINTS.SUPPLIERS.BY_ID(id),
            controller.signal
          );
          supplierDispatch({
            type: "DELETE_SUPPLIER",
            payload: { id },
          });
          toast.success("Proveedor eliminado exitosamente");
        } catch (err) {
          if (err instanceof Error) {
            if (err.name !== "AbortError") {
              toast.error("No se pudo eliminar el Proveedor", {
                unstyled: true,
                classNames: {
                  error: "bg-red-500 flex gap-2 rounded-md p-4",
                },
              });
            }
          } else {
            toast.error("No se pudo eliminar el Proveedor", {
              unstyled: true,
              classNames: {
                error: "bg-red-500 flex gap-2 rounded-md p-4",
              },
            });
          }
        } finally {
          controller.abort();
        }
      },
      [supplierDispatch]
    );

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
