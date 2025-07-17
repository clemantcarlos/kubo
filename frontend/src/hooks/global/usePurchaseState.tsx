import { useCallback, useReducer } from "react";
//  REDUCERS
import { initialState, purchaseReducer } from "@/reducers/purchase";
// SCHEMAS
import { PurchaseFormSchema } from "@/modules/Inventory/purchase/schema/purchase.schema"
// TYPES
import { Purchase } from "@/modules/Inventory/purchase/types/purchase.type";
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

export default function usePurchaseState() {
  const [purchaseOrderState, supplierDispatch] = useReducer(
    purchaseReducer,
    initialState
  );

  const getPurchases = useCallback(
    async (page: number, search?: string) => {
      const controller = new AbortController();
      try {
        if (search && search.length > 0) {
          const res = await getQuery<Purchase[]>(
            API_ENDPOINTS.PURCHASES.BASE_GET_ORDER(page, 10, search),
            controller.signal
          );
          supplierDispatch({
            type: "GET_PURCHASES",
            payload: res,
          });
          return;
        }

        const res = await getQuery<Purchase[]>(
          API_ENDPOINTS.PURCHASES.BASE_GET_ORDER(page, 10),
          controller.signal
        );
        supplierDispatch({ type: "GET_PURCHASES", payload: res });
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
  const getPurchase = useCallback(
    async (id: number) => {
      const controller = new AbortController();
      const findPurchase = purchaseOrderState.data.find(
        (purchase) => purchase.id === id
      );

      if (findPurchase)
        return { success: true, data: findPurchase, meta: purchaseOrderState.meta };

      try {
        const res = await getQuery<Purchase>(
          API_ENDPOINTS.PURCHASES.ORDER_BY_ID(id),
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
    [purchaseOrderState]
  );
  const addPurchase = async (purchase: PurchaseFormSchema) => {
    const controller = new AbortController();
    try {
      const newPurchase = await postQueryJson<Purchase, PurchaseFormSchema>(
        API_ENDPOINTS.PRODUCTS.BASE,
        purchase,
        controller.signal
      );
      supplierDispatch({
        type: "ADD_PURCHASE",
        payload: newPurchase.data,
      });
      toast.success("Orden de compra creada exitosamente");
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== "AbortError") {
          toast.error("No se pudo crear la orden de compra", {
            unstyled: true,
            classNames: {
              error: "bg-red-500 flex gap-2 rounded-md p-4",
            },
          });
        }
      } else {
        toast.error("No se pudo actualizar la orden de compra", {
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
  const updatePurchase = async (id: number, purchase: PurchaseFormSchema)  => {
      const controller = new AbortController();
      try {
        const updatedPurchase = await putQueryJson<Purchase, PurchaseFormSchema>(
          API_ENDPOINTS.PURCHASES.ORDER_BY_ID(id),
          purchase,
          controller.signal
        );
        supplierDispatch({
          type: "UPDATE_PURCHASE",
          payload: updatedPurchase.data,
        });
        toast.success("Orden de compra actualizadaexitosamente");
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") {
            toast.error("No se pudo actualizar la orden de compra", {
              unstyled: true,
              classNames: {
                error: "bg-red-500 flex gap-2 rounded-md p-4",
              },
            });
          }
        } else {
          toast.error("No se pudo actualizar la orden de compra", {
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
  const deletePurchase = useCallback(
      async (id: number) => {
        const controller = new AbortController();
        try {
          await deleteQuery<Purchase>(
            API_ENDPOINTS.PURCHASES.ORDER_BY_ID(id),
            controller.signal
          );
          supplierDispatch({
            type: "DELETE_PURCHASE",
            payload: { id },
          });
          toast.success("Orden de compra eliminado exitosamente");
        } catch (err) {
          if (err instanceof Error) {
            if (err.name !== "AbortError") {
              toast.error("No se pudo eliminar la orden de compra", {
                unstyled: true,
                classNames: {
                  error: "bg-red-500 flex gap-2 rounded-md p-4",
                },
              });
            }
          } else {
            toast.error("No se pudo eliminar la orden de compra", {
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
    value: purchaseOrderState,
    methods: {
      getPurchase,
      getPurchases,
      addPurchase,
      updatePurchase,
      deletePurchase,
    },
  };
}
