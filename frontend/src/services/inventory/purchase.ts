import { Purchase } from "@/modules/inventory/purchase/types/purchase.type";
import { deleteQuery, getQuery, GetResponse, postQueryJson, putQueryJson } from "../queries";
import { API_ENDPOINTS } from "../endpoints";
import { PurchaseFormSchema } from "@/modules/inventory/purchase/schema/purchase.schema";

type ProductResponse = { 
  purchaseOrders: Purchase[], 
  meta: GetResponse<Purchase[]>['meta'], 
  nextCursor?: number, 
  prevCursor?: number 
}

  export const getPurchases = async (
    { pageParam = 1, search = ''} : { pageParam?: number, search?: string }
  ): Promise<ProductResponse> => {
    const controller = new AbortController();

    const res = await getQuery<Purchase[]>(
      API_ENDPOINTS.PURCHASES.BASE_GET_ORDER(pageParam, 10, search),
      controller.signal
    );

    const nextCursor = res.meta.page > res.meta.totalPages ? undefined : res.meta.page + 1;
    const prevCursor = res.meta.page > 1 ? res.meta.page - 1 : undefined;
    
    return {
      purchaseOrders: res.data,
      meta: res.meta,
      nextCursor,
      prevCursor,
    };
  };
  export const getPurchase = async (
    { id }: { id: number }
  ) => {
    const controller = new AbortController();
    return await getQuery<Purchase>(
      API_ENDPOINTS.PURCHASES.ORDER_BY_ID(id),
      controller.signal
    );
  }
  export const addPurchase = async (
    { purchaseOrder }: { purchaseOrder: PurchaseFormSchema }
  ) => {
    const controller = new AbortController();
    return await postQueryJson<Purchase, PurchaseFormSchema>(
      API_ENDPOINTS.PRODUCTS.BASE,
      purchaseOrder,
      controller.signal
    );
  };
  export const updatePurchase = async (
    { id, purchaseOrder } : { id: number, purchaseOrder: PurchaseFormSchema }
  ) => {
    const controller = new AbortController();
    return await putQueryJson<Purchase, PurchaseFormSchema>(
      API_ENDPOINTS.PURCHASES.ORDER_BY_ID(id),
      purchaseOrder,
      controller.signal
    );
  };
  export const deletePurchase = async (
    { id } : { id: number }
  ) => { 
    const controller = new AbortController();
    return await deleteQuery<Purchase>(
      API_ENDPOINTS.PURCHASES.ORDER_BY_ID(id),
      controller.signal
    );
  }